/**
 * Sanwo Checkout Block — Registration entry point.
 *
 * Uses wp.blocks.registerBlockType (no JSX, no build step required).
 *
 * @package Sanwo_Payments
 */

/* global wp, SanwoCheckoutEdit */

( function() {
	'use strict';

	var registerBlockType = wp.blocks.registerBlockType;
	var __                = wp.i18n.__;

	registerBlockType( 'sanwo/checkout', {
		title: __( 'Sanwo Checkout', 'sanwo' ),
		description: __( 'Add a Sanwo payment checkout button.', 'sanwo' ),
		category: 'widgets',
		icon: 'money-alt',
		keywords: [
			__( 'payment', 'sanwo' ),
			__( 'checkout', 'sanwo' ),
			__( 'sanwo', 'sanwo' ),
		],
		supports: {
			html: false,
			align: true,
		},
		attributes: {
			amount: {
				type: 'string',
				default: '',
			},
			currency: {
				type: 'string',
				default: '',
			},
			email: {
				type: 'string',
				default: '',
			},
			description: {
				type: 'string',
				default: '',
			},
			buttonText: {
				type: 'string',
				default: 'Pay Now',
			},
			provider: {
				type: 'string',
				default: '',
			},
			publicKey: {
				type: 'string',
				default: '',
			},
		},

		/**
		 * Editor component.
		 *
		 * @param {Object} props Block props.
		 * @return {Object} Element tree.
		 */
		edit: function( props ) {
			return window.SanwoCheckoutEdit( props );
		},

		/**
		 * Server-side rendered — no save output needed.
		 *
		 * @return {null} Null signals server-side rendering.
		 */
		save: function() {
			return null;
		},
	} );
} )();
