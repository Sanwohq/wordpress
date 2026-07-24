<?php
/**
 * Sanwo WooCommerce Gateway — extends WC_Payment_Gateway.
 *
 * @package Sanwo_Payments
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Sanwo_WooCommerce_Gateway
 */
class Sanwo_WooCommerce_Gateway extends WC_Payment_Gateway {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->id                 = 'sanwo';
		$this->icon               = '';
		$this->has_fields         = false;
		$this->method_title       = __( 'Sanwo Payments', 'sanwo-payments' );
		$this->method_description = __( 'Accept payments via Paystack, Flutterwave, Razorpay, Monnify, or Interswitch using the Sanwo SDK.', 'sanwo-payments' );
		$this->order_button_text  = __( 'Proceed to Payment', 'sanwo-payments' );

		// Load settings form fields.
		$this->init_form_fields();
		$this->init_settings();

		$this->title       = $this->get_option( 'title', __( 'Sanwo Payments', 'sanwo-payments' ) );
		$this->description = $this->get_option( 'description', __( 'Pay securely using your preferred payment provider.', 'sanwo-payments' ) );
		$this->enabled     = $this->get_option( 'enabled', 'no' );
		$this->provider    = $this->get_option( 'provider', 'paystack' );
		$this->public_key  = $this->get_option( 'public_key', '' );
		$this->test_mode   = 'yes' === $this->get_option( 'test_mode', 'no' );

		// Save admin settings.
		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );

		// Receipt page — renders the Sanwo checkout.
		add_action( 'woocommerce_receipt_' . $this->id, array( $this, 'receipt_page' ) );

		// Handle payment callback via query var.
		add_action( 'woocommerce_api_sanwo_callback', array( $this, 'handle_callback' ) );
	}

	/**
	 * Define gateway settings form fields.
	 */
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'     => array(
				'title'   => __( 'Enable/Disable', 'sanwo-payments' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable Sanwo Payments', 'sanwo-payments' ),
				'default' => 'no',
			),
			'title'       => array(
				'title'       => __( 'Title', 'sanwo-payments' ),
				'type'        => 'text',
				'description' => __( 'This controls the title displayed during checkout.', 'sanwo-payments' ),
				'default'     => __( 'Sanwo Payments', 'sanwo-payments' ),
				'desc_tip'    => true,
			),
			'description' => array(
				'title'       => __( 'Description', 'sanwo-payments' ),
				'type'        => 'textarea',
				'description' => __( 'This controls the description displayed during checkout.', 'sanwo-payments' ),
				'default'     => __( 'Pay securely using your preferred payment provider.', 'sanwo-payments' ),
				'desc_tip'    => true,
			),
			'provider'    => array(
				'title'       => __( 'Payment Provider', 'sanwo-payments' ),
				'type'        => 'select',
				'description' => __( 'Select the payment provider to process transactions.', 'sanwo-payments' ),
				'default'     => 'paystack',
				'options'     => array(
					'paystack'    => __( 'Paystack', 'sanwo-payments' ),
					'flutterwave' => __( 'Flutterwave', 'sanwo-payments' ),
					'razorpay'    => __( 'Razorpay', 'sanwo-payments' ),
					'monnify'     => __( 'Monnify', 'sanwo-payments' ),
					'interswitch' => __( 'Interswitch', 'sanwo-payments' ),
				),
				'desc_tip'    => true,
			),
			'public_key'  => array(
				'title'       => __( 'Public Key', 'sanwo-payments' ),
				'type'        => 'text',
				'description' => __( 'Enter the public/publishable key from your payment provider.', 'sanwo-payments' ),
				'default'     => '',
				'desc_tip'    => true,
			),
			'test_mode'   => array(
				'title'       => __( 'Test Mode', 'sanwo-payments' ),
				'type'        => 'checkbox',
				'label'       => __( 'Enable test mode', 'sanwo-payments' ),
				'description' => __( 'Use your test/sandbox API keys for transactions.', 'sanwo-payments' ),
				'default'     => 'no',
				'desc_tip'    => true,
			),
		);
	}

	/**
	 * Display a note on the checkout page explaining that the user
	 * will be redirected to complete payment.
	 */
	public function payment_fields() {
		if ( $this->description ) {
			echo '<p>' . wp_kses_post( $this->description ) . '</p>';
		}
		echo '<p>' . esc_html__( 'You will be redirected to complete your payment after placing the order.', 'sanwo-payments' ) . '</p>';
	}

	/**
	 * Process the payment — redirect to the receipt/pay page.
	 *
	 * @param  int $order_id WooCommerce order ID.
	 * @return array
	 */
	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );

		if ( ! $order ) {
			wc_add_notice( __( 'Order not found. Please try again.', 'sanwo-payments' ), 'error' );
			return array( 'result' => 'failure' );
		}

		// Mark order as pending.
		$order->update_status( 'pending', __( 'Awaiting Sanwo payment.', 'sanwo-payments' ) );

		// Generate a unique reference.
		$reference = 'sanwo_' . $order_id . '_' . wp_generate_password( 8, false );
		$order->update_meta_data( '_sanwo_reference', $reference );
		$order->save();

		return array(
			'result'   => 'success',
			'redirect' => $order->get_checkout_payment_url( true ),
		);
	}

	/**
	 * Render the Sanwo checkout on the receipt (pay) page.
	 *
	 * @param int $order_id WooCommerce order ID.
	 */
	public function receipt_page( $order_id ) {
		$order = wc_get_order( $order_id );

		if ( ! $order ) {
			echo '<p>' . esc_html__( 'Order not found.', 'sanwo-payments' ) . '</p>';
			return;
		}

		// Enqueue embed script.
		sanwo_enqueue_embed_script();

		// Convert WooCommerce amount (major units) to minor units.
		$amount    = absint( round( floatval( $order->get_total() ) * 100 ) );
		$currency  = $order->get_currency();
		$email     = $order->get_billing_email();
		$reference = $order->get_meta( '_sanwo_reference' );
		$provider  = $this->provider;
		$key       = $this->public_key;

		$success_url = $this->get_return_url( $order );
		$cancel_url  = esc_url( wc_get_checkout_url() );

		echo '<div id="sanwo-wc-checkout" style="text-align:center;padding:40px 0;">';
		echo '<p>' . esc_html__( 'Initializing payment... Please wait.', 'sanwo-payments' ) . '</p>';
		echo '</div>';

		?>
		<script>
		(function() {
			function initSanwoCheckout() {
				if ( typeof window.Sanwo === 'undefined' || typeof window.Sanwo.create !== 'function' ) {
					setTimeout( initSanwoCheckout, 200 );
					return;
				}

				var sanwo = window.Sanwo.create({
					provider: <?php echo wp_json_encode( $provider ); ?>,
					publicKey: <?php echo wp_json_encode( $key ); ?>
				});

				sanwo.checkout({
					amount: <?php echo intval( $amount ); ?>,
					currency: <?php echo wp_json_encode( $currency ); ?>,
					reference: <?php echo wp_json_encode( $reference ); ?>,
					customer: {
						email: <?php echo wp_json_encode( $email ); ?>,
						firstName: <?php echo wp_json_encode( $order->get_billing_first_name() ); ?>,
						lastName: <?php echo wp_json_encode( $order->get_billing_last_name() ); ?>,
						phone: <?php echo wp_json_encode( $order->get_billing_phone() ); ?>
					},
					description: <?php echo wp_json_encode(
						sprintf(
							/* translators: %s: order number */
							__( 'Payment for order #%s', 'sanwo-payments' ),
							$order->get_order_number()
						)
					); ?>
				}).then(function( result ) {
					if ( result && result.status === 'successful' ) {
						window.location.href = <?php echo wp_json_encode( $success_url ); ?>;
					} else if ( result && result.status === 'cancelled' ) {
						window.location.href = <?php echo wp_json_encode( $cancel_url ); ?>;
					} else {
						var container = document.getElementById( 'sanwo-wc-checkout' );
						if ( container ) {
							container.innerHTML = '<p style="color:#c00;">' +
								<?php echo wp_json_encode( __( 'Payment was not completed. Please try again.', 'sanwo-payments' ) ); ?> +
								'</p><a href="' + <?php echo wp_json_encode( $cancel_url ); ?> + '" class="button">' +
								<?php echo wp_json_encode( __( 'Return to Checkout', 'sanwo-payments' ) ); ?> +
								'</a>';
						}
					}
				}).catch(function( err ) {
					var container = document.getElementById( 'sanwo-wc-checkout' );
					if ( container ) {
						container.innerHTML = '<p style="color:#c00;">' +
							<?php echo wp_json_encode( __( 'An error occurred during payment. Please try again.', 'sanwo-payments' ) ); ?> +
							'</p><a href="' + <?php echo wp_json_encode( $cancel_url ); ?> + '" class="button">' +
							<?php echo wp_json_encode( __( 'Return to Checkout', 'sanwo-payments' ) ); ?> +
							'</a>';
					}
				});
			}

			if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
				initSanwoCheckout();
			} else {
				document.addEventListener( 'DOMContentLoaded', initSanwoCheckout );
			}
		})();
		</script>
		<?php
	}

	/**
	 * Handle the callback from Sanwo (optional webhook endpoint).
	 */
	public function handle_callback() {
		// This endpoint can be extended for server-side payment verification.
		// For now, the client-side result handles the redirect flow.
		wp_die( 'Sanwo callback received', 'Sanwo', array( 'response' => 200 ) );
	}
}
