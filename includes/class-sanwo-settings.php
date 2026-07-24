<?php
/**
 * Sanwo Settings — admin settings page under Settings → Sanwo Payments.
 *
 * @package Sanwo_Payments
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class Sanwo_Settings
 */
class Sanwo_Settings {

	/**
	 * Singleton instance.
	 *
	 * @var Sanwo_Settings|null
	 */
	private static $instance = null;

	/**
	 * Option key used to store all settings.
	 *
	 * @var string
	 */
	const OPTION_KEY = 'sanwo_settings';

	/**
	 * Supported providers.
	 *
	 * @var array
	 */
	private $providers = array(
		'paystack'    => 'Paystack',
		'flutterwave' => 'Flutterwave',
		'razorpay'    => 'Razorpay',
		'monnify'     => 'Monnify',
		'interswitch' => 'Interswitch',
	);

	/**
	 * Return or create the singleton instance.
	 *
	 * @return Sanwo_Settings
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Add the settings page under the Settings menu.
	 */
	public function add_settings_page() {
		add_options_page(
			__( 'Sanwo Payments', 'sanwo' ),
			__( 'Sanwo Payments', 'sanwo' ),
			'manage_options',
			'sanwo',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Register settings, sections, and fields via the Settings API.
	 */
	public function register_settings() {
		register_setting(
			'sanwo_settings_group',
			self::OPTION_KEY,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
				'default'           => array(
					'provider'         => 'paystack',
					'public_key'       => '',
					'debug_mode'       => '',
					'default_currency' => 'NGN',
				),
			)
		);

		// General section.
		add_settings_section(
			'sanwo_general_section',
			__( 'General Settings', 'sanwo' ),
			array( $this, 'render_section_description' ),
			'sanwo'
		);

		add_settings_field(
			'sanwo_provider',
			__( 'Payment Provider', 'sanwo' ),
			array( $this, 'render_provider_field' ),
			'sanwo',
			'sanwo_general_section'
		);

		add_settings_field(
			'sanwo_public_key',
			__( 'Public Key', 'sanwo' ),
			array( $this, 'render_public_key_field' ),
			'sanwo',
			'sanwo_general_section'
		);

		add_settings_field(
			'sanwo_default_currency',
			__( 'Default Currency', 'sanwo' ),
			array( $this, 'render_currency_field' ),
			'sanwo',
			'sanwo_general_section'
		);

		add_settings_field(
			'sanwo_debug_mode',
			__( 'Debug Mode', 'sanwo' ),
			array( $this, 'render_debug_field' ),
			'sanwo',
			'sanwo_general_section'
		);
	}

	/**
	 * Sanitize the settings array before saving.
	 *
	 * @param  array $input Raw input.
	 * @return array Sanitized.
	 */
	public function sanitize_settings( $input ) {
		$sanitized = array();

		$sanitized['provider'] = isset( $input['provider'] ) && array_key_exists( $input['provider'], $this->providers )
			? sanitize_text_field( $input['provider'] )
			: 'paystack';

		$sanitized['public_key']       = isset( $input['public_key'] ) ? sanitize_text_field( $input['public_key'] ) : '';
		$sanitized['default_currency'] = isset( $input['default_currency'] ) ? strtoupper( sanitize_text_field( $input['default_currency'] ) ) : 'NGN';
		$sanitized['debug_mode']       = ! empty( $input['debug_mode'] ) ? '1' : '';

		return $sanitized;
	}

	/**
	 * Render section description.
	 */
	public function render_section_description() {
		echo '<p>' . esc_html__( 'Configure your Sanwo payment settings below. You will need a public key from your chosen provider.', 'sanwo' ) . '</p>';
	}

	/**
	 * Render provider dropdown field.
	 */
	public function render_provider_field() {
		$options  = $this->get_settings();
		$current  = isset( $options['provider'] ) ? $options['provider'] : 'paystack';

		echo '<select id="sanwo_provider" name="' . esc_attr( self::OPTION_KEY ) . '[provider]">';
		foreach ( $this->providers as $value => $label ) {
			printf(
				'<option value="%s" %s>%s</option>',
				esc_attr( $value ),
				selected( $current, $value, false ),
				esc_html( $label )
			);
		}
		echo '</select>';
		echo '<p class="description">' . esc_html__( 'Select the payment provider you want to use.', 'sanwo' ) . '</p>';
	}

	/**
	 * Render public key text field.
	 */
	public function render_public_key_field() {
		$options = $this->get_settings();
		$value   = isset( $options['public_key'] ) ? $options['public_key'] : '';

		printf(
			'<input type="text" id="sanwo_public_key" name="%s[public_key]" value="%s" class="regular-text" placeholder="%s" />',
			esc_attr( self::OPTION_KEY ),
			esc_attr( $value ),
			esc_attr__( 'pk_test_xxxxxxxxxxxxxxxx', 'sanwo' )
		);
		echo '<p class="description">' . esc_html__( 'Enter the public/publishable key from your payment provider.', 'sanwo' ) . '</p>';
	}

	/**
	 * Render default currency text field.
	 */
	public function render_currency_field() {
		$options = $this->get_settings();
		$value   = isset( $options['default_currency'] ) ? $options['default_currency'] : 'NGN';

		printf(
			'<input type="text" id="sanwo_default_currency" name="%s[default_currency]" value="%s" class="small-text" placeholder="NGN" />',
			esc_attr( self::OPTION_KEY ),
			esc_attr( $value )
		);
		echo '<p class="description">' . esc_html__( 'ISO 4217 currency code (e.g. NGN, USD, GBP).', 'sanwo' ) . '</p>';
	}

	/**
	 * Render debug mode checkbox.
	 */
	public function render_debug_field() {
		$options = $this->get_settings();
		$checked = ! empty( $options['debug_mode'] ) ? '1' : '';

		printf(
			'<label><input type="checkbox" id="sanwo_debug_mode" name="%s[debug_mode]" value="1" %s /> %s</label>',
			esc_attr( self::OPTION_KEY ),
			checked( $checked, '1', false ),
			esc_html__( 'Enable debug logging in the browser console.', 'sanwo' )
		);
	}

	/**
	 * Render the full settings page.
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		?>
		<div class="wrap sanwo-settings-wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php
				settings_fields( 'sanwo_settings_group' );
				do_settings_sections( 'sanwo' );
				submit_button( __( 'Save Settings', 'sanwo' ) );
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Enqueue admin CSS and JS on the settings page only.
	 *
	 * @param string $hook_suffix Current admin page hook.
	 */
	public function enqueue_admin_assets( $hook_suffix ) {
		if ( 'settings_page_sanwo' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'sanwo-admin',
			SANWO_PLUGIN_URL . 'admin/css/sanwo-admin.css',
			array(),
			SANWO_VERSION
		);

		wp_enqueue_script(
			'sanwo-admin',
			SANWO_PLUGIN_URL . 'admin/js/sanwo-admin.js',
			array( 'jquery' ),
			SANWO_VERSION,
			true
		);
	}

	/**
	 * Get all settings as an array.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$defaults = array(
			'provider'         => 'paystack',
			'public_key'       => '',
			'debug_mode'       => '',
			'default_currency' => 'NGN',
		);

		$settings = get_option( self::OPTION_KEY, $defaults );

		return wp_parse_args( $settings, $defaults );
	}
}
