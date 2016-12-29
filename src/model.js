tabular.Model = function(element, options) {
  this._element = element;
  this._options = options;

  this._element.on('model:fetch', $.proxy(this, '_fetch'));
};

tabular.Model.prototype = {
  _metadata: {},

  _fetch: function(e, metadata) {
    this._element.trigger('model:startFetch');

    if (metadata) {
      $.extend(this._metadata, metadata);
    }

    $.ajax({
      url:     this._options.source,
      data:    this._metadata,
      success: $.proxy(this, '_processResponse')
    });
  },

  _processResponse: function(response) {
    this._element.trigger('model:stopFetch', response);
    this._element.trigger('model:success', response);
  }
};