=== Sanwo ===
Contributors: sanwohq
Tags: payments, paystack, flutterwave, woocommerce, checkout
Requires at least: 5.8
Tested up to: 7.0
Stable tag: 1.1.0
Requires PHP: 7.4
License: Apache-2.0
License URI: https://www.apache.org/licenses/LICENSE-2.0

Accept payments with Sanwo — one plugin, multiple providers. Works with Paystack, Flutterwave, Razorpay, Monnify, and Interswitch.

== Description ==

Sanwo Payments is a universal payment plugin that wraps multiple payment providers behind one simple interface. Configure your provider and public key once, then drop payment buttons anywhere on your site.

**Supported Providers:**

* Paystack
* Flutterwave
* Razorpay
* Monnify
* Interswitch

**Features:**

* **Shortcode** — Use `[sanwo_checkout]` to add payment buttons to any post or page.
* **Gutenberg Block** — Drop the Sanwo Checkout block into the editor with a visual preview.
* **WooCommerce Gateway** — Accept payments at checkout using any supported provider.
* **No build step** — The Gutenberg block works without JSX or a build process.
* **Lightweight** — Only loads the Sanwo embed script on pages that need it.

== Installation ==

1. Upload the `sanwo` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Go to **Settings > Sanwo Payments** and enter your provider and public key.
4. Use the `[sanwo_checkout]` shortcode or the Gutenberg block to add payment buttons.
5. For WooCommerce, go to **WooCommerce > Settings > Payments** and enable **Sanwo Payments**.

== Frequently Asked Questions ==

= What providers are supported? =

Paystack, Flutterwave, Razorpay, Monnify, and Interswitch.

= Do I need a separate account with each provider? =

You only need an account with the provider you choose. Sanwo handles the integration — you just provide the public key.

= How do I set the amount? =

Amounts are in **minor units** (kobo, cents, paise, etc.). For example, 5000 NGN = 500000 kobo.

= Can I use this with WooCommerce? =

Yes. Enable the Sanwo gateway under WooCommerce > Settings > Payments. The amount is automatically calculated from the order total.

= Does this require a build step? =

No. The Gutenberg block uses `wp.element.createElement` directly, so no JSX compilation or npm build is needed.

== Screenshots ==

1. Settings page — configure your provider and public key.
2. Shortcode output — a styled payment button on the frontend.
3. Gutenberg block — visual editor with sidebar settings.
4. WooCommerce checkout — seamless payment flow.

== Changelog ==

= 1.1.0 =
* Custom amounts — let customers enter their own payment amount (donations, tips, pay-what-you-want).
* Custom provider templates — use any payment gateway by providing your own template.
* Register reusable custom providers by name.
* Updated Sanwo embed SDK with new features.

= 1.0.0 =
* Initial release.
* Settings page for provider, public key, currency, and debug mode.
* `[sanwo_checkout]` shortcode with full attribute support.
* Gutenberg block with editor preview and sidebar controls.
* WooCommerce payment gateway integration.

== Upgrade Notice ==

= 1.1.0 =
Custom amounts and custom provider templates — see changelog for details.

= 1.0.0 =
Initial release.
