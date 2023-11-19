// Private functions

function Suggestion(data) {
  var o = Array.isArray(data)
      ? { label: data[0], value: data[1] }
      : typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

  this.label = o.label || o.value;
  this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
  get: function() { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
  return "" + this.label;
};


Awesomplete.prototype.evaluate = function() {

  var me = this;
  var value = this.input.value;

  if (this._list && this._list.length > 0) {
      this.index = -1;
      // Populate list with options that match
      this.ul.innerHTML = "";

      if(value.length >= this.minChars) {
          this.suggestions = this._list
              .map( function ( item ) {
                  return new Suggestion( me.data( item, value ) );
              } )
              .filter( function ( item ) {
                  return me.filter( item, value );
              } );
      }
      else {
          this.suggestions = this._list
              .map( function ( item ) {
              return new Suggestion( me.data( item, value ) );
          } )
      }

      if (this.sort !== false) {
          this.suggestions = this.suggestions.sort(this.sort);
      }

      this.suggestions = this.suggestions.slice(0, this.maxItems);

      this.suggestions.forEach(function(text, index) {
          me.ul.appendChild(me.item(text, value, index));
      });

      if (this.ul.children.length === 0) {

          this.status.textContent = "No results found";

          this.close({ reason: "nomatches" });

      }else {
          this.open();

      }
  }
}
