
export class DropDown {
  constructor(el) {
    this.dd = el;
    this.val = '';
    this.initEvents();
  }

  private dd;
  private val = '';

  initEvents() {
    var obj = this;
    $(document).on('click', this.dd, function (event) {
      $(obj.dd).toggleClass('active');
      return false;
    });
    $(document).on('click', '.dropdown > li', function (event) {
      $('span', obj.dd).text($(event.target).text() + ' pack');
    });
    $(document).click(function () {
      $('.dropdown-wrapper', obj.dd).removeClass('active');
    });
  }
}


export class ScrollIntoView {
  constructor(el) {
    this.el = el
  }

  private el;

  now() {
    $('body').animate({ scrollTop : this.el.offset().top }, 'slow');
  }
}
