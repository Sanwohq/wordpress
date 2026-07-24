<?php
/**
 * Sanwo Block — Gutenberg block for Sanwo Checkout.
 *
 * @package Sanwo_Payments
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Sanwo_Block
 */
class Sanwo_Block {

	/**
	 * Singleton instance.
	 *
	 * @var Sanwo_Block|null
	 */
	private static $instance = null;

	/**
	 * Return or create the singleton instance.
	 *
	 * @return Sanwo_Block
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor — register the block on init.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Register the Gutenberg block.
	 */
	public function register_block() {
		// Register editor scripts.
		wp_register_script(
			'sanwo-checkout-editor',
			SANWO_PLUGIN_URL . 'blocks/sanwo-checkout/index.js',
			array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
			SANWO_VERSION,
			true
		);

		wp_register_script(
			'sanwo-checkout-edit',
			SANWO_PLUGIN_URL . 'blocks/sanwo-checkout/edit.js',
			array( 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
			SANWO_VERSION,
			true
		);

		// Pass settings to the editor script.
		$settings = Sanwo_Settings::get_settings();
		wp_localize_script( 'sanwo-checkout-editor', 'sanwoBlockSettings', array(
			'defaultProvider' => $settings['provider'],
			'defaultCurrency' => $settings['default_currency'],
			'publicKey'       => $settings['public_key'],
		) );

		register_block_type(
			SANWO_PLUGIN_DIR . 'blocks/sanwo-checkout',
			array(
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Server-side render callback for the block.
	 *
	 * @param  array $attributes Block attributes.
	 * @return string HTML output.
	 */
	public function render_block( $attributes ) {
		$settings = Sanwo_Settings::get_settings();

		$amount      = isset( $attributes['amount'] ) ? $attributes['amount'] : '';
		$currency    = ! empty( $attributes['currency'] ) ? $attributes['currency'] : $settings['default_currency'];
		$email       = ! empty( $attributes['email'] ) ? $attributes['email'] : '';
		$description = isset( $attributes['description'] ) ? $attributes['description'] : '';
		$button_text = ! empty( $attributes['buttonText'] ) ? $attributes['buttonText'] : __( 'Pay Now', 'sanwo-payments' );
		$provider    = ! empty( $attributes['provider'] ) ? $attributes['provider'] : $settings['provider'];
		$public_key  = ! empty( $attributes['publicKey'] ) ? $attributes['publicKey'] : $settings['public_key'];

		if ( empty( $amount ) ) {
			if ( current_user_can( 'manage_options' ) ) {
				return '<p class="sanwo-error">' . esc_html__( 'Sanwo: Please set an amount for the checkout block.', 'sanwo-payments' ) . '</p>';
			}
			return '';
		}

		// Fall back to the logged-in user's email.
		if ( empty( $email ) && is_user_logged_in() ) {
			$current_user = wp_get_current_user();
			$email        = $current_user->user_email;
		}

		// Enqueue the embed script.
		sanwo_enqueue_embed_script();

		// Build data attributes.
		$data_attrs = array(
			'data-sanwo-provider' => $provider,
			'data-sanwo-key'      => $public_key,
			'data-sanwo-amount'   => $amount,
			'data-sanwo-currency' => $currency,
		);

		if ( ! empty( $email ) ) {
			$data_attrs['data-sanwo-email'] = $email;
		}
		if ( ! empty( $description ) ) {
			$data_attrs['data-sanwo-description'] = $description;
		}
		if ( ! empty( $settings['debug_mode'] ) ) {
			$data_attrs['data-sanwo-debug'] = 'true';
		}

		$attr_string = '';
		foreach ( $data_attrs as $key => $value ) {
			$attr_string .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
		}

		$html = sprintf(
			'<div class="wp-block-sanwo-checkout"><button type="button" class="sanwo-button"%s>%s</button></div>',
			$attr_string,
			esc_html( $button_text )
		);

		$html .= '<script>document.addEventListener("DOMContentLoaded",function(){if(window.Sanwo&&window.Sanwo.autoInit){window.Sanwo.autoInit();}});</script>';

		return $html;
	}
}
