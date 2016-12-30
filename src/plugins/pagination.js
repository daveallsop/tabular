// Adds pagination functionality to tabular
// Expects the server to return an object:
// {
//   metadata: {
//     current_page: 1,
//     total_pages:  3
//   }
// }

tabular.Pagination = function(element, options) {
  this._element = element;
  this._options = options;
  this._init();
};

tabular.Pagination.prototype = {
  _page: 1,

  destroy: function() {
    this._element.off('model:success.tabularPagination');
    this._paginator.remove();
  },

  _init: function() {
    this._setup();
    this._element.on('model:success.tabularPagination', $.proxy(this, '_render'));
  },

  _render: function(e, response) {
    this._page       = response.metadata.current_page;
    this._totalPages = response.metadata.total_pages;
    var options      = { totalPages: this._totalPages };

    if (this._page < 2) {
      options.prevDisabled = true;
    }
    if (this._page === this._totalPages) {
      options.nextDisabled = true;
    }
    var markup = this._markup(options);
      this._paginator.html(markup);
  },

  _setup: function() {
    var markup = this._markup({
      prevDisabled: true,
      nextDisabled: true,
      totalPages:   1
    });
    this._paginator = $('<div class="tabular-paginator"/>')
      .html(markup)
      .on('click', 'button',  $.proxy(this, '_clickButton'))
      .on('change', 'select', $.proxy(this, '_changeSelect'))
      .appendTo(this._element);
  },

  _changeSelect: function(e) {
    var page = $(e.target).val();
    this._element.trigger('model:fetch', { page: page });
  },

  _clickButton: function(e) {
    var action = $(e.target).data('action'),
      page;
    switch(action) {
      case 'first':
        page = 1;
        break;
      case 'prev':
        page = this._page - 1;
        break;
      case 'next':
        page = this._page + 1;
        break;
      case 'last':
        page = this._totalPages;
        break;
    }
    if (page) {
      this._element.trigger('model:fetch', { page: page});
    }
  },

  _markup: function(options) {
    var prevDisabled = options.prevDisabled ? ' disabled="disabled"' : '',
      nextDisabled   = options.nextDisabled ? ' disabled="disabled"' : '';
    var markup = [
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="first"' + prevDisabled + '>First</button>',
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="prev"' + prevDisabled + '>Previous</button>',
      this._buildSelect(options.totalPages),
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="next"' + nextDisabled + '>Next</button>',
      '<button type="button" class="tabular-btn tabular-pagination-btn" data-action="last"' + nextDisabled + '>Last</button>'
    ];
    return markup.join('');
  },

  _buildSelect: function(totalPages) {
    if (totalPages === 1) return;
    var options = [];
    for (var i = 1; i <= totalPages; i++) {
      var selected = i === this._page ? ' selected ' : '';
      options.push('<option value="' + i + '"' + selected + '>' + i + '</option>');
    }
    return '<select>' + options.join('') + '</select>';
  }
};