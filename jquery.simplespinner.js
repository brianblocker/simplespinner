/**
 * Simple Spinner v 0.9.7
 * @author BrianBlocker.com for AliveCity.com
 * @date Dec 20, 2011
 * @tools Aptana Studio 3 / 27" iMac 2011
 */

( function( $ )
{
	$.fn.simplespinner = function( method )
	{
		if( methods[ method ] )
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else if( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error( method + ' is not a valid argument for simplespinner.' );
		}
	}
	
	$.fn.simplespinner.defaults = {
		max				: 100,
		min				: 0,
		beforeChange	: new Function,
		change			: new Function,
		drag			: new Function,
		stop			: new Function,
		value			: false,
		step			: 1,
		slide_step		: 1,
		shift_step		: 10,
		width			: 65,
		append			: '',
		zero			: false,
		auto_format		: true
	};
	
	var methods = {
		init : function( options )
		{
			return this.each( function()
			{
				var $interface
				,	$this	= $( this )
				,	$input	= $this
				,	opts	= $.extend( {}, $.fn.simplespinner.defaults, options )
				,	numeric = 0;
				
				if( ! $this.get( 0 ).nodeName.toLowerCase() == 'input' )
					return false;
				
				if( typeof opts.value === 'number' || typeof opts.value === 'string' )
					$this.val( opts.value );
				
				numeric = getNumericValue( $this );
				
				if( opts.auto_format )
				{
					if( opts.zero && numeric === 0 )
						$this.val( opts.zero );
					else
						$this.val( numeric + opts.append );
				}
				
				$interface = createInterface( $this );
				createInterfaceEvents( $interface, $this, opts );
				applyStyles( $interface, $this, opts );
			});
		},
		get_value : function()
		{
			return getValues( this );
		},
		destroy : function()
		{
			$( document ).off( '.simplespinner' );
			
			return this;
		}
	},
	applyStyles = function( $interface, $input, opts )
	{
		$interface.width( opts.width );
		$input.width( opts.width - 14 );
	},
	createInterface = function( $this )
	{
		$this.wrap( '<div class="ui-spinner-holder" />' );
		
		var $parent = $this.parent();
		
		$parent.append( '<a class="ui-spinner-control ui-spinner-up">Up</a><a class="ui-spinner-drag-handle">Drag Handle</a><a class="ui-spinner-control ui-spinner-down">down</a>' );
		
		return $parent;
	},
	createInterfaceEvents = function( $interface, $input, opts )
	{
		$interface.find( '.ui-spinner-up' ).on( 'click.simplespinner', function( e )
		{
			var values = getValues( $input );
			
			optsFn( e, values, 'beforeChange', opts );
			
			increment( $input, values, 1, e, opts );
		}).disableSelection();
		
		$interface.find( '.ui-spinner-down' ).on( 'click.simplespinner', function( e )
		{;
			var values = getValues( $input );
			
			optsFn( e, values, 'beforeChange', opts );
			
			increment( $input, values, -1, e, opts );
		}).disableSelection();
		
		$interface.on( 'blur.simplespinner', 'INPUT', function( e )
		{
			var values = getValues( $input );
			
			optsFn( e, values, 'beforeChange', opts );
			
			increment( $input, values, 0, e, opts );
		});
		
		$interface.find( '.ui-spinner-drag-handle' ).on( 'mousedown.simplespinner', function( e )
		{
			var start		= e.pageY,
					values	= getValues( $input );
			
			optsFn( e, values, 'beforeChange', opts );
			
			increment( $input, values, 1, e, opts );
			
			$( window ).on( 'mousemove.simplespinner', function( e )
			{
				var amount = ( start - e.pageY ),
						values = getValues( $input );
				
				if( amount > 0 )
					increment( $input, values, 1, e, opts );
				if( amount < 0 )
					increment( $input, values, -1, e, opts );
			}).disableSelection();
		});
		
		$( document ).on( 'mouseup.simplespinner', function( e )
		{
			$( window ).off( 'mousemove.simplespinner' ).enableSelection();
			
			optsFn( e, getValues( $input ), 'stop', opts );
		});
	},
	getNumericValue = function( $input )
	{
		return Number( $input.val().replace( /[^0-9\-]/g, '' ) );
	},
	getValues = function( $input )
	{
		var current = {
			numeric : getNumericValue( $input ),
			value : $input.val()
		};
		
		return current;
	},
	increment = function( $input, current_values, modifier, e, opts )
	{
		var amt = ( e.shiftKey ? opts.shift_step : opts.step ) * modifier
		,	new_numeric_value = current_values.numeric + amt
		,	new_values = { numeric : 0, value : '' };
				
		if( new_numeric_value < opts.min )
			new_numeric_value = opts.min;
		
		if( new_numeric_value > opts.max )
			new_numeric_value = opts.max;
		
		new_values = {
			numeric : new_numeric_value,
			value : new_numeric_value + opts.append
		}
		
		if( opts.zero && new_numeric_value === 0 )
			new_values.value = opts.zero;
		
		$input.val( new_values.value );
		$input.change();
		
		optsFn( e, new_values, 'change', opts );
	},
	optsFn = function( e, values, fn, opts )
	{
		if( opts[ fn ] && typeof opts[ fn ] === 'function' )
			opts[ fn ]( e, values );
	};
	
})( jQuery );
