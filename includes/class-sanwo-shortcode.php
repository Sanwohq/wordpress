<?php
/**
 * Sanwo Shortcode — [sanwo_checkout] for embedding payment buttons.
 *
 * @package Sanwo_Payments
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Sanwo_Shortcode
 */
class Sanwo_Shortcode {

	/**
	 * Singleton instance.
	 *
	 * @var Sanwo_Shortcode|null
	 */
	private static $instance = null;

	/**
	 * Return or create the singleton instance.
	 *
	 * @return Sanwo_Shortcode
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor — register the shortcode.
	 */
	private function __construct() {
		add_shortcode( 'sanwo_checkout', array( $this, 'render' ) );
	}

	/**
	 * Render the [sanwo_checkout] shortcode.
	 *
	 * @param  array  $atts    Shortcode attributes.
	 * @param  string $content Enclosed content (unused).
	 * @return string HTML output.
	 */
	public function render( $atts, $content = '' ) {
		$settings = Sanwo_Settings::get_settings();

		$atts = shortcode_atts(
			array(
				'amount'       => '',
				'currency'     => $settings['default_currency'],
				'email'        => '',
				'provider'     => $settings['provider'],
				'key'          => $settings['public_key'],
				'description'  => '',
				'button_text'  => __( 'Pay Now', 'sanwo' ),
				'button_class' => 'sanwo-button',
				'callback'     => '',
				'first_name'   => '',
				'last_name'    => '',
				'phone'        => '',
				'reference'    => '',
			),
			$atts,
			'sanwo_checkout'
		);

		// Amount is required.
		if ( empty( $atts['amount'] ) ) {
			if ( current_user_can( 'manage_options' ) ) {
				return '<p class="sanwo-error">' . esc_html__( 'Sanwo: The "amount" attribute is required.', 'sanwo' ) . '</p>';
			}
			return '';
		}

		// Fall back to the logged-in user's email.
		if ( empty( $atts['email'] ) && is_user_logged_in() ) {
			$current_user  = wp_get_current_user();
			$atts['email'] = $current_user->user_email;
		}

		// Enqueue the embed script and styles for this page.
		sanwo_enqueue_embed_script();

		// Build data attributes.
		$data_attrs = array(
			'data-sanwo-provider' => $atts['provider'],
			'data-sanwo-key'      => $atts['key'],
			'data-sanwo-amount'   => $atts['amount'],
			'data-sanwo-currency' => $atts['currency'],
		);

		if ( ! empty( $atts['email'] ) ) {
			$data_attrs['data-sanwo-email'] = $atts['email'];
		}
		if ( ! empty( $atts['description'] ) ) {
			$data_attrs['data-sanwo-description'] = $atts['description'];
		}
		if ( ! empty( $atts['callback'] ) ) {
			$data_attrs['data-sanwo-callback'] = $atts['callback'];
		}
		if ( ! empty( $atts['first_name'] ) ) {
			$data_attrs['data-sanwo-first-name'] = $atts['first_name'];
		}
		if ( ! empty( $atts['last_name'] ) ) {
			$data_attrs['data-sanwo-last-name'] = $atts['last_name'];
		}
		if ( ! empty( $atts['phone'] ) ) {
			$data_attrs['data-sanwo-phone'] = $atts['phone'];
		}
		if ( ! empty( $atts['reference'] ) ) {
			$data_attrs['data-sanwo-reference'] = $atts['reference'];
		}

		// Debug mode from global settings.
		if ( ! empty( $settings['debug_mode'] ) ) {
			$data_attrs['data-sanwo-debug'] = 'true';
		}

		// Build the HTML attribute string.
		$attr_string = '';
		foreach ( $data_attrs as $key => $value ) {
			$attr_string .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
		}

		// Render the button.
		$html = sprintf(
			'<button type="button" class="%s"%s>%s</button>',
			esc_attr( $atts['button_class'] ),
			$attr_string,
			esc_html( $atts['button_text'] )
		);

		// Trigger autoInit after the script loads.
		$html .= '<script>document.addEventListener("DOMContentLoaded",function(){if(window.Sanwo&&window.Sanwo.autoInit){window.Sanwo.autoInit();}});</script>';

		return $html;
	}
}
