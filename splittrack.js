// Copyright (c)2008 Site Meter, Inc. 
// <![CDATA[

var protocol = "http";
var cookiesEnabled = "1";
if ( document.cookie == "" ) {
	document.cookie = "cookies=yes";
	if ( document.cookie == "" )
		cookiesEnabled = "0";
	else
		document.cookie = "";
}

var SiteMeter2 =
{
	init:function( newSiteID ) {
		SiteMeter2.siteID = newSiteID;
		SiteMeter2.clickImage = document.createElement( "img" );

		if ( ( typeof( g_lastSiteID2 ) != 'undefined' ) && ( g_lastSiteID2 == newSiteID ) )
			return;
				
		SiteMeter2.trackPageLoad( );
		if ( detectClicks )
			SiteMeter2.addEvent( window, "load", SiteMeter2.trackOutClicks );

	},
	
	trackOutClicks:function( ) {
		for( var i = 0; i < document.links.length; i++ ) {
			SiteMeter2.addEvent( document.links[i], "click", SiteMeter2.onClick );
		}
		
	},

	trackPageLoad:function( ) {
		var newImage = document.createElement( "img" );
		newImage.width = 0;
		newImage.height = 0;
				
		var dateToday = new Date();
		var timeZoneOffset = ( typeof( dateToday.getTimezoneOffset )!= 'undefined' ) ? dateToday.getTimezoneOffset( ) : '';
		var referrer = SiteMeter2.getReferral( );
		
		var trackImage = protocol + "://tr.sitemeter.com/track?site=" + SiteMeter2.siteID;
		trackImage += "&u=" + encodeURIComponent( window.location.href );
		trackImage += "&r=" + referrer;
		trackImage += "&jsid=IU1o0NGf5CrkWiAEL4pe";
		trackImage += "&w=" + window.screen.width; 
		trackImage += "&h=" + window.screen.height;
		trackImage += "&clr=" + window.screen.colorDepth;
		trackImage += "&tzo=" + timeZoneOffset;
		trackImage += "&lang=" + encodeURIComponent( navigator.language ? navigator.language : navigator.userLanguage );
		trackImage += "&js=" + jsVersion;
		trackImage += "&ck=" + cookiesEnabled;
		trackImage += "&flv=" + encodeURIComponent( flashVer );
		trackImage += "&ni=1&rnd=" + Math.random( );
		newImage.src = trackImage;

		var scriptRef = SiteMeter2.getScriptElement( );
		var parentOfScript = SiteMeter2.getParent( scriptRef );
		if ( parentOfScript )
			parentOfScript.appendChild( newImage );
	},
	
	logEvent:function( sEvent, sText, sURL ) {
		if ( document.images && !SiteMeter2.isLocalURL( sURL ) && SiteMeter2.clickImage )
		{
			var clickImageURL = protocol + "://tr.sitemeter.com/track?site=" + SiteMeter2.siteID; 
			clickImageURL += "&jsid=IU1o0NGf5CrkWiAEL4pe";
			clickImageURL += "&e=" + sEvent;
			clickImageURL += "&l=" + encodeURIComponent( sURL );
			clickImageURL += "&t=" + encodeURIComponent( sText );
			clickImageURL += "&u="+ encodeURIComponent( window.location.href );
			SiteMeter2.clickImage.src = clickImageURL;
		}
	},
	
	trimFragment:function( sString ) {
		var fragIndex = sString.indexOf( "#" );
		return ( fragIndex > 0 ? sString.substring( 0, fragIndex ) : sString );
	},
	
	isLocalURL:function( sURL ) {
		return ( SiteMeter2.trimFragment( document.location.href ) == SiteMeter2.trimFragment( sURL ) );
	},
	
	getReferral:function( ) {
	 	var sRef = "";
		var g_d = document;

		if ( typeof( g_frames ) != "undefined" && g_frames )
			sRef = top.document.referrer;

		if ( ( sRef == "" ) || ( sRef == "[unknown origin]" ) || ( sRef == "unknown") || (sRef == "undefined" ) ) {
			if ( document["parent"] != null ) 
				if ( parent["document"] != null ) // ACCESS ERROR HERE!
					if ( parent.document["referrer"] != null ) 
						if ( typeof( parent.document ) == "object" )
							sRef = parent.document.referrer;
		} 

		if ( ( sRef == "" ) || ( sRef == "[unknown origin]" ) || ( sRef == "unknown") || (sRef == "undefined" ) ) {
			if ( g_d["referrer"] != null ) 
				sRef = g_d["referrer"];
		}

		if ( ( sRef == "" ) || ( sRef == "[unknown origin]" ) || ( sRef == "unknown") || (sRef == "undefined" ) )
			sRef = "";
			
		return encodeURIComponent( sRef );
	},
	
	getParent:function( e ) {
		if ( !e )
			return null;

		if ( e.parentNode ) 
			return e.parentNode;			
		else if ( e.parentElement )
			return e.parentElement;
		else
			return null;
	},
	
	getScriptElement:function( ) {
		var refScript = null;
		refScript = document.getElementById( "SiteMeter2Script" );
		if ( refScript )
			return refScript;
			
		var pageScripts = document.getElementsByTagName( "script" );
		for( var i = 0; i < pageScripts.length; i++ ) {
			if ( pageScripts[i].src )
			{
				var sSource = pageScripts[i].src.toLowerCase( );
				if ( sSource.indexOf( "site=" + SiteMeter2.siteID ) > 0 )
					return pageScripts[i];
			}
		}

		return null;
	},
	
	getTarget:function( e ) {
		var targ = null;
		if ( !e )
			e = window.event;

		if ( e.target ) 
			targ = e.target;
		else if ( e.srcElement ) 
			targ = e.srcElement;

		if ( targ.nodeType && targ.nodeType == 3 ) // Safari bug 
			targ = targ.parentNode;

		return targ;
	},
	
	elementText:function( e ) {
		do {
			var sText = ( e.text )? e.text : e.innerText;
			if ( sText )
				return sText.substr( 0,100 );
			if ( e.alt )
				return e.alt;
			if ( e.src )
				return e.src;
			e = SiteMeter2.getParent( e );
		} while ( e );
		
		return "";
	},
	
	elementURL:function( e ) {
		do {
			if ( ( e.href ) && ( e.nodeName.toUpperCase( ) == 'A') )
				return e.href;
			
			e = SiteMeter2.getParent( e );
		} while ( e );
		
		return "";
	},
	
	onClick:function( e ) {
		var target = SiteMeter2.getTarget( e );
		SiteMeter2.logEvent( "click", SiteMeter2.elementText( target ), SiteMeter2.elementURL( target ) );
	},
	
	addEvent:function( obj, sEvent, func ) {
		if ( obj.addEventListener )
		    obj.addEventListener( sEvent, func, false );
		else if ( obj.attachEvent )	
			obj.attachEvent( "on" + sEvent, func );
		else
			return false;

		return true;
	}

}

SiteMeter2.init( siteID );

var g_lastSiteID2 = siteID;
// ]]>