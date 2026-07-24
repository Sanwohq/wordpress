/**
 * Sanwo Payments — Admin settings page JavaScript.
 *
 * Handles interactive behavior on the settings page,
 * such as showing contextual help when the provider changes.
 *
 * @package Sanwo_Payments
 */

/* global jQuery */

( function( $ ) {
	'use strict';

	/**
	 * Provider-specific placeholder hints for the public key field.
	 */
	var keyPlaceholders = {
		paystack:    'pk_test_xxxxxxxxxxxxxxxx',
		flutterwave: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxx',
		razorpay:    'rzp_test_xxxxxxxxxxxxxxxx',
		monnify:     'MK_TEST_xxxxxxxxxxxxxxxx',
		interswitch: 'INTERS_TEST_xxxxxxxxxxxxxxxx',
	};

	/**
	 * Update the public key placeholder based on the selected provider.
	 */
	function updateKeyPlaceholder() {
		var provider    = $( '#sanwo_provider' ).val();
		var placeholder = keyPlaceholders[ provider ] || 'pk_test_xxxxxxxxxxxxxxxx';

		$( '#sanwo_public_key' ).attr( 'placeholder', placeholder );
	}

	$( document ).ready( function() {
		// Set initial placeholder.
		updateKeyPlaceholder();

		// Update on provider change.
		$( '#sanwo_provider' ).on( 'change', updateKeyPlaceholder );
	} );
} )( jQuery );
