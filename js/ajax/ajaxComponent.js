import $ from 'jquery';

export class AjaxComponent {

    constructor( classOrId, href ) {
        this.identifier = classOrId;
        this.$htmlElement = $( this.identifier );
        this.url = href;
        this.withPushState = false;

        this.preventDoubleClick = function () {
        };
        this.onSuccessCallback = function (result) {
        };
        this.onFailCallback = function (status) {
        };
        this.beforeRequest = function () {
        };
    }

    static changeCursor( busy ) {
        let cursor = 'default';
        if ( busy ) {
            cursor = 'wait';
        }
        $( 'body' ).css( 'cursor', cursor );
    }

    onSuccessFunction( funct ) {
        this.onSuccessCallback = funct;
        return this;
    }

    onFailFunction( funct ) {
        this.onFailCallback = funct;
        return this;
    }

    preventDoubleClick( classOrId ) {
        // GL.LOADER.preventDoubleClick(this.jqXHR, classOrId, '');
        return this;
    }

    get(mode = "html") {
        let that = this;
        AjaxComponent.changeCursor( true );

        that.jqXHR = $.get( that.url, function ( data ) {

            if ( that.withPushState ) {
                // Add History Entry using pushState
                history.pushState( null, null, that.url ); // on change l'url du navigateur à la volée
            }

            switch (mode) {
                case "replace" : {
                    that.$htmlElement.replaceWith( data );
                    break;
                }
                case "noreplace" : {
                    break;
                }
                default: {
                    that.$htmlElement.html(data);
                }
            }

            that.$htmlElement = $( that.identifier );

            AjaxComponent.changeCursor( false );

            that.onSuccessCallback(data);
        }, 'html' )
            .fail( function (status) {
                AjaxComponent.changeCursor( false );
                that.onFailCallback(status);

            } );
        return that;
    }

    post( data, json = true , mode = "html") {
        let that = this;
        if ( !data ) {
            data = {};
        }
        that.beforeRequest( data );
        AjaxComponent.changeCursor( true );

        let contentType = "application/x-www-form-urlencoded";

        if ( json ) {
            contentType = "application/json";
            data = JSON.stringify( data );
        }

        that.jqXHR = $.ajax( {
            url: that.url,
            type: "post",
            dataType: "html", // expected format for response
            contentType: contentType, // send as JSON
            data: data
        } ).done( function ( html ) {
            if ( that.withPushState ) {
                // Add History Entry using pushState
                history.pushState( null, null, that.url ); // on change l'url du navigateur à la volée
            }

            switch (mode) {
                case "replace" : {
                    that.$htmlElement.replaceWith(html);
                    break;
                }
                case "noreplace" : {
                    break;
                }
                default: {
                    that.$htmlElement.html(html);
                }
            }
            that.$htmlElement = $( that.identifier );
            AjaxComponent.changeCursor( false );
            that.onSuccessCallback(html);
        } ).fail( function (status) {
            AjaxComponent.changeCursor( false );
            that.onFailCallback(status);
        } );

        return that;
    }

}
