$(document).ready(function () {
  //load init
  init();
  // demo event keyup input zipcode
  $('input[name="zip_code"]').on('keyup', function () {
    if ($(this).val() != '') {
      $(this).next().next().removeClass("btn-gray");
      $(this).next().next().addClass("btn-red");
    } else {
      $(this).next().next().removeClass("btn-red");
      $(this).next().next().addClass("btn-gray");
    }
  });

  $.fn.datetimepicker.dates['ja'] = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    today: "Today"
  };

  // set datepicker
  // $('.datepicker').datepicker({
  //     format: 'yyyy/mm/dd'
  // }).datepicker("setDate", new Date());
  $('.datepicker').datepicker({
    format: 'yyyy/mm/dd',
    language: 'ja'
  }).datepicker({
    showClear: true,
    showClose: true,
  });

  // event left menu, sidenav
  var status_sidenav = true;
  var status_sidenav_mobile = false;
  var status_calendar = false;
  $(window).resize(function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width > 992) {
      //reset style left-menu
      $('.left-menu').css('margin-right', '');
      $('.left-menu-item .collapse').collapse('hide');
      $('#logout-menu-item').css('display', 'none');
      $('.overlay').hide();

      if ($('div.content').find('section div.table-search div.dataTables_wrapper').length == 0) {
        $('div.content').find('section').removeClass('h-auto');
        // set heigt 550px
        $('div.content').find('section').addClass('min-h-550');
      }
    }
    if (width <= 992) {
      $('.left-menu-item .collapse').collapse('hide');
      if (status_sidenav_mobile) {
        $('.left-menu').css('margin-right', '0px');
        $('.overlay').show();
      }

      if ($('div.content').find('section div.table-search div.dataTables_wrapper').length == 0) {
        $('div.content').find('section').removeClass('min-h-550');
        $('div.content').find('section').addClass('h-auto');
      }

      // $('div.content').find('section').removeClass('h-550');
      // // set height auto
      // $('div.content').find('section').addClass('h-auto');
    }
  });

  if ($('.btn-toggle-sidenav').length > 0) {
    //fixed btn_toggle_sidenav top-left
    var old_top_btn_toggle_sidenav = $('.btn-toggle-sidenav').css('top').replace(/[^-\d\.]/g, '');
    $(window).scroll(function (e) {
      $('.btn-toggle-sidenav').css('top', parseInt(old_top_btn_toggle_sidenav) + $(this).scrollTop());
    });

    $('.btn-toggle-sidenav').on('click', function () {
      if (status_sidenav) {
        $('.left-menu').css('margin-left', '-230px');
        $(this).removeClass("pe-7s-angle-left");
        $(this).addClass("pe-7s-angle-right");
        $(this).css('opacity', '1');
        $('.content').css('width', '100%');
        status_sidenav = false;
      } else {
        $('.left-menu').css('margin-left', '0px');
        $(this).removeClass("pe-7s-angle-right");
        $(this).addClass("pe-7s-angle-left");
        $(this).removeAttr("style");
        $('.content').css('width', 'calc(100% - 250px)');
        status_sidenav = true;
      }
    });
    $('.btn-toggle-hamburger-menu').on('click', function () {
      if (status_sidenav_mobile) {
        $('.left-menu').css('margin-right', '-251px');
        $(this).removeClass("pe-7s-close");
        $(this).addClass("pe-7s-menu");
        $('.overlay').hide();
        status_sidenav_mobile = false;
      } else {
        $('.left-menu').css('margin-right', '0px');
        $(this).removeClass("pe-7s-menu");
        $(this).addClass("pe-7s-close");
        $('.overlay').show();
        $('#logout-menu-item').css('display', 'block');
        status_sidenav_mobile = true;
      }
    });
    $('.overlay').on('click', function () {
      $('.left-menu').css('margin-right', '-251px');
      $('.btn-toggle-hamburger-menu').removeClass("pe-7s-close");
      $('.btn-toggle-hamburger-menu').addClass("pe-7s-menu");
      $('.overlay').hide();
      status_sidenav_mobile = false;
    });
    //calendar
    $('.btn-toggle-calendar').on('click', function () {
      if (status_calendar) {
        $('#calendarNavbar').css('margin-right', '-281px');
        $('i.btn-toggle-calendar').css('right', '-30px');
        status_calendar = false;
      } else {
        $('#calendarNavbar').css('margin-right', '0px');
        $('i.btn-toggle-calendar').css('right', '266px')
        status_calendar = true;
      }
    });
  }

})
function init() {
  //default open collapse
  let w = window.innerWidth;
  let h = window.innerHeight;

  if (w > 992) {
    $('.left-menu-item .collapse').collapse('show');
  } else {
    $('.left-menu-item .collapse').collapse('hide');
  }

  // screen search
  if ($('div.content').find('section div.table-search div.dataTables_wrapper').length > 0) {
    $('div.content').find('section').removeClass('min-h-550');
    $('div.content').find('section').addClass('h-auto');
  } else if ($('div.content').find('section div.table-search div.dataTables_wrapper').length == 0) {
    $('div.content').find('section').removeClass('h-auto');
    $('div.content').find('section').addClass('min-h-550');
  }
}
function getCurrentDate() {
  let dateObj = new Date();
  let month = dateObj.getMonth() + 1;
  let day = String(dateObj.getDate()).padStart(2, '0');
  let year = dateObj.getFullYear();
  let output = '';
  if (month < 10) {
    output = year + '-' + '0' + month + '-' + day;
  } else {
    output = year + '-' + month + '-' + day;
  }
  return output;
}