/**
 * Sanwo Checkout Block — Editor component.
 *
 * Uses wp.element.createElement (no JSX, no build step required).
 *
 * @package Sanwo_Payments
 */

/* global wp, sanwoBlockSettings */

( function() {
	'use strict';

	var el               = wp.element.createElement;
	var Fragment         = wp.element.Fragment;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody        = wp.components.PanelBody;
	var TextControl      = wp.components.TextControl;
	var SelectControl    = wp.components.SelectControl;
	var __               = wp.i18n.__;

	/**
	 * Default settings passed from PHP via wp_localize_script.
	 */
	var defaults = window.sanwoBlockSettings || {
		defaultProvider: 'paystack',
		defaultCurrency: 'NGN',
		publicKey: '',
	};

	/**
	 * Edit component for the Sanwo Checkout block.
	 *
	 * @param {Object} props Block props.
	 * @return {Object} Element tree.
	 */
	window.SanwoCheckoutEdit = function( props ) {
		var attributes    = props.attributes;
		var setAttributes = props.setAttributes;

		var amount      = attributes.amount || '';
		var currency    = attributes.currency || defaults.defaultCurrency;
		var email       = attributes.email || '';
		var description = attributes.description || '';
		var buttonText  = attributes.buttonText || __( 'Pay Now', 'sanwo-payments' );
		var provider    = attributes.provider || defaults.defaultProvider;
		var publicKey   = attributes.publicKey || '';

		// Inspector sidebar controls.
		var inspector = el(
			InspectorControls,
			null,
			el(
				PanelBody,
				{ title: __( 'Payment Settings', 'sanwo-payments' ), initialOpen: true },
				el( TextControl, {
					label: __( 'Amount (minor units)', 'sanwo-payments' ),
					help: __( 'Amount in minor units, e.g. 500000 for 5,000 NGN.', 'sanwo-payments' ),
					value: amount,
					onChange: function( val ) { setAttributes( { amount: val } ); },
				} ),
				el( TextControl, {
					label: __( 'Currency', 'sanwo-payments' ),
					help: __( 'ISO currency code. Leave blank to use the default from settings.', 'sanwo-payments' ),
					value: currency,
					onChange: function( val ) { setAttributes( { currency: val } ); },
				} ),
				el( TextControl, {
					label: __( 'Email', 'sanwo-payments' ),
					help: __( 'Customer email. Leave blank to use the logged-in user email.', 'sanwo-payments' ),
					value: email,
					onChange: function( val ) { setAttributes( { email: val } ); },
				} ),
				el( TextControl, {
					label: __( 'Description', 'sanwo-payments' ),
					value: description,
					onChange: function( val ) { setAttributes( { description: val } ); },
				} )
			),
			el(
				PanelBody,
				{ title: __( 'Provider Settings', 'sanwo-payments' ), initialOpen: false },
				el( SelectControl, {
					label: __( 'Provider', 'sanwo-payments' ),
					help: __( 'Leave at default to use the provider from plugin settings.', 'sanwo-payments' ),
					value: provider,
					options: [
						{ label: __( 'Paystack', 'sanwo-payments' ),    value: 'paystack' },
						{ label: __( 'Flutterwave', 'sanwo-payments' ), value: 'flutterwave' },
						{ label: __( 'Razorpay', 'sanwo-payments' ),    value: 'razorpay' },
						{ label: __( 'Monnify', 'sanwo-payments' ),     value: 'monnify' },
						{ label: __( 'Interswitch', 'sanwo-payments' ), value: 'interswitch' },
					],
					onChange: function( val ) { setAttributes( { provider: val } ); },
				} ),
				el( TextControl, {
					label: __( 'Public Key', 'sanwo-payments' ),
					help: __( 'Override the public key from plugin settings.', 'sanwo-payments' ),
					value: publicKey,
					onChange: function( val ) { setAttributes( { publicKey: val } ); },
				} )
			),
			el(
				PanelBody,
				{ title: __( 'Button', 'sanwo-payments' ), initialOpen: false },
				el( TextControl, {
					label: __( 'Button Text', 'sanwo-payments' ),
					value: buttonText,
					onChange: function( val ) { setAttributes( { buttonText: val } ); },
				} )
			)
		);

		// Block preview in the editor.
		var preview = el(
			'div',
			{ className: 'wp-block-sanwo-checkout' },
			el(
				'button',
				{
					type: 'button',
					className: 'sanwo-button',
					onClick: function( e ) { e.preventDefault(); },
				},
				buttonText
			),
			! amount
				? el(
					'p',
					{ style: { color: '#999', fontSize: '13px', marginTop: '8px' } },
					__( 'Set the amount in the block settings panel.', 'sanwo-payments' )
				)
				: el(
					'p',
					{ style: { color: '#666', fontSize: '13px', marginTop: '8px' } },
					provider.charAt( 0 ).toUpperCase() + provider.slice( 1 ) + ' — ' + amount + ' ' + currency
				)
		);

		return el( Fragment, null, inspector, preview );
	};
} )();
