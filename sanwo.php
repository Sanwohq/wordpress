<?php
/**
 * Plugin Name: Sanwo
 * Plugin URI:  https://github.com/Sanwohq/wordpress
 * Description: Accept payments with Sanwo — one plugin, multiple providers. Works with Paystack, Flutterwave, Razorpay, Monnify, and Interswitch.
 * Version:     1.1.0
 * Author:      SanwoHQ
 * Author URI:  https://sanwohq.com
 * License:     Apache-2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 * Text Domain: sanwo
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Tested up to: 7.0
 */

defined( 'ABSPATH' ) || exit;

// Plugin constants.
define( 'SANWO_VERSION', '1.1.0' );
define( 'SANWO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SANWO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include core classes.
require_once SANWO_PLUGIN_DIR . 'includes/class-sanwo-settings.php';
require_once SANWO_PLUGIN_DIR . 'includes/class-sanwo-shortcode.php';
require_once SANWO_PLUGIN_DIR . 'includes/class-sanwo-block.php';

/**
 * Initialize the plugin.
 */
function sanwo_init() {
	Sanwo_Settings::instance();
	Sanwo_Shortcode::instance();
	Sanwo_Block::instance();
}
add_action( 'plugins_loaded', 'sanwo_init' );

/**
 * Conditionally load the WooCommerce gateway when WooCommerce is active.
 */
function sanwo_load_woocommerce_gateway() {
	if ( class_exists( 'WC_Payment_Gateway' ) ) {
		require_once SANWO_PLUGIN_DIR . 'includes/class-sanwo-woocommerce.php';
		add_filter( 'woocommerce_payment_gateways', 'sanwo_register_woocommerce_gateway' );
	}
}
add_action( 'plugins_loaded', 'sanwo_load_woocommerce_gateway', 20 );

/**
 * Register the Sanwo gateway with WooCommerce.
 *
 * @param  array $gateways Existing gateways.
 * @return array
 */
function sanwo_register_woocommerce_gateway( $gateways ) {
	$gateways[] = 'Sanwo_WooCommerce_Gateway';
	return $gateways;
}

/**
 * Enqueue the Sanwo CDN embed script on the frontend.
 *
 * The script is only enqueued when a page uses the shortcode or block,
 * so individual classes call this helper when needed.
 */
function sanwo_enqueue_embed_script() {
	if ( wp_script_is( 'sanwo-embed', 'enqueued' ) ) {
		return;
	}

	wp_enqueue_script(
		'sanwo-embed',
		SANWO_PLUGIN_URL . 'assets/sanwo-embed.js',
		array(),
		SANWO_VERSION,
		true
	);

	wp_enqueue_style(
		'sanwo-frontend',
		SANWO_PLUGIN_URL . 'assets/sanwo-frontend.css',
		array(),
		SANWO_VERSION
	);
}

/**
 * Plugin activation hook.
 */
function sanwo_activate() {
	// Set default options on first activation.
	if ( false === get_option( 'sanwo_settings' ) ) {
		$defaults = array(
			'provider'         => 'paystack',
			'public_key'       => '',
			'debug_mode'       => '',
			'default_currency' => 'NGN',
		);
		add_option( 'sanwo_settings', $defaults );
	}
}
register_activation_hook( __FILE__, 'sanwo_activate' );

/**
 * Plugin deactivation hook.
 */
function sanwo_deactivate() {
	// Clean up transients if any.
	delete_transient( 'sanwo_activation_notice' );
}
register_deactivation_hook( __FILE__, 'sanwo_deactivate' );

/**
 * Add settings link on the plugins page.
 *
 * @param  array $links Existing links.
 * @return array
 */
function sanwo_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=sanwo' ) ),
		esc_html__( 'Settings', 'sanwo' )
	);
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'sanwo_plugin_action_links' );

