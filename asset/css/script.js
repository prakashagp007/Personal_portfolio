jQuery(document).ready(function () {
  jQuery('.skillbar').each(function () {
    jQuery(this).find('.skillbar-bar').animate({
      width: jQuery(this).attr('data-percent')
    }, 3000);
  });
});

$(".images img").click(function () {
  $(this).addClass("zoom");
});

$(".images img").mouseleave(function () {
  $(this).removeClass("zoom");
});




//cursor interaction



const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
  cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;")
});

document.addEventListener('click', e => {
  cursor.classList.add("expand");
  setTimeout(() => {
    cursor.classList.remove("expand");
  }, 500);
});



// animation

const animatedEls = document.querySelectorAll("[data-animation]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const animation = entry.target.getAttribute("data-animation");

    if (entry.isIntersecting) {
      entry.target.classList.add("animated", `${animation}`);
    } else {
      entry.target.classList.remove("animated", `${animation}`);
    }
  });
});

animatedEls.forEach((el) => observer.observe(el));



// var thumbnails = document.getElementById("thumbnails")
// var imgs = thumbnails.getElementsByTagName("img")
// var main = document.getElementById("main")
// var counter = 0;

// for (let i = 0; i < imgs.length; i++) {
//   let img = imgs[i]


//   img.addEventListener("click", function () {
//     main.src = this.src
//   })

// }

// navbar

// ---------Responsive-navbar-active-animation-----------
function test() {
  var tabsNewAnim = $('#navbarSupportedContent');
  var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
  var activeItemNewAnim = tabsNewAnim.find('.active');
  var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  var itemPosNewAnimTop = activeItemNewAnim.position();
  var itemPosNewAnimLeft = activeItemNewAnim.position();
  $(".hori-selector").css({
    "top": itemPosNewAnimTop.top + "px",
    "left": itemPosNewAnimLeft.left + "px",
    "height": activeWidthNewAnimHeight + "px",
    "width": activeWidthNewAnimWidth + "px"
  });
  $("#navbarSupportedContent").on("click", "li", function (e) {
    $('#navbarSupportedContent ul li').removeClass("active");
    $(this).addClass('active');
    var activeWidthNewAnimHeight = $(this).innerHeight();
    var activeWidthNewAnimWidth = $(this).innerWidth();
    var itemPosNewAnimTop = $(this).position();
    var itemPosNewAnimLeft = $(this).position();
    $(".hori-selector").css({
      "top": itemPosNewAnimTop.top + "px",
      "left": itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
  });
}
$(document).ready(function () {
  setTimeout(function () { test(); });
});
$(window).on('resize', function () {
  setTimeout(function () { test(); }, 500);
});
$(".navbar-toggler").click(function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(function () { test(); });
});



// --------------add active class-on another-page move----------
jQuery(document).ready(function ($) {
  // Get current path and find target link
  var path = window.location.pathname.split("/").pop();

  // Account for home page with empty path
  if (path == '') {
    path = 'index.html';
  }

  var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
  // Add active class to target link
  target.parent().addClass('active');
});




// Add active class on another page linked
// ==========================================
// $(window).on('load',function () {
//     var current = location.pathname;
//     console.log(current);
//     $('#navbarSupportedContent ul li a').each(function(){
//         var $this = $(this);
//         // if the current path is like this link, make it active
//         if($this.attr('href').indexOf(current) !== -1){
//             $this.parent().addClass('active');
//             $this.parents('.menu-submenu').addClass('show-dropdown');
//             $this.parents('.menu-submenu').parent().addClass('active');
//         }else{
//             $this.parent().removeClass('active');
//         }
//     })
// });




// animation


var $translateY_elements = $('.scroll-anime-translateY');
var $translateX_r_elements = $('.scroll-anime-translateX-right');
var $translateX_l_elements = $('.scroll-anime-translateX-left');
var $scale_elements = $('.scroll-anime-scale');
var $number_elements = $('.scroll-anime-number');


var $window = $(window);
var scroll_anime_tY;
var scroll_anime_tX_left;
var scroll_anime_tX_right;
var scroll_anime_scale;
var scroll_anime_number;
var scroll_anime_scrollspy;
var el_offset;

if ($(window).width() < 1024) {
  el_offset = 0;
} else {
  el_offset = 80;
}

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  if ($translateY_elements.length) {
    $.each($translateY_elements, function () {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      //check to see if this current container is within viewport
      // 320 = offset bottom


      if ((element_bottom_position >= window_top_position) && (element_top_position <= (window_bottom_position - el_offset))) {

        if (!$element.hasClass('in-view')) {
          $element.addClass('in-view');
          scroll_anime_tY = anime({
            targets: $element[0],
            translateY: ['100px', '0px'],
            opacity: [0, 1],
            loop: false,
            duration: 400,
            delay: function (el, i) {
              return i * 400;
            },
            easing: 'easeOutExpo',
          });
        }
      }
      // else {
      //   $element.removeClass('in-view');
      // }

    })
  };


  if ($translateX_l_elements.length) {
    $.each($translateX_l_elements, function () {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      //check to see if this current container is within viewport
      // 320 = offset bottom
      if ((element_bottom_position >= window_top_position) && (element_top_position <= (window_bottom_position - el_offset))) {
        if (!$element.hasClass('in-view')) {
          $element.addClass('in-view');
          scroll_anime_tX_left = anime({
            targets: $element[0],
            translateX: ['-100px', '0px'],
            opacity: [0.5, 1],
            loop: false,
            duration: 400,
            delay: function (el, i) {
              return i * 400;
            },
            easing: 'easeOutExpo',
          });
        }
      }
      // else {
      //   $element.removeClass('in-view');
      // }
    })
  };

  if ($translateX_r_elements.length) {
    $.each($translateX_r_elements, function () {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      //check to see if this current container is within viewport
      // 320 = offset bottom
      if ((element_bottom_position >= window_top_position) && (element_top_position <= (window_bottom_position - el_offset))) {
        if (!$element.hasClass('in-view')) {
          $element.addClass('in-view');
          scroll_anime_tX_right = anime({
            targets: $element[0],
            translateX: ['100px', '0px'],
            opacity: [0, 1],
            loop: false,
            duration: 400,
            delay: function (el, i) {
              return i * 400;
            },
            easing: 'easeOutExpo',
          });
        }
      }
      // else {
      //   $element.removeClass('in-view');
      // }
    })
  };

  if ($scale_elements.length) {
    $.each($scale_elements, function () {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      //check to see if this current container is within viewport
      // 320 = offset bottom
      if ((element_bottom_position >= window_top_position) && (element_top_position <= (window_bottom_position - el_offset))) {
        if (!$element.hasClass('in-view')) {
          $element.addClass('in-view');
          scroll_anime_scale = anime({
            targets: $element[0],
            scale: [0.8, 1],
            opacity: [0.6, 1],
            loop: false,
            duration: 400,
            delay: function (el, i) {
              return i * 400;
            },
            easing: 'easeOutExpo',
          });
        }
      }
      // else {
      //   $element.removeClass('in-view');
      // }
    })
  };

  if ($number_elements.length) {
    $.each($number_elements, function () {
      var $element = $(this);
      var element_height = $element.outerHeight();
      var element_top_position = $element.offset().top;
      var element_bottom_position = (element_top_position + element_height);
      var valuefinal = this.max
      //check to see if this current container is within viewport
      // 320 = offset bottom
      if ((element_bottom_position >= window_top_position) && (element_top_position <= (window_bottom_position - el_offset))) {
        if (!$element.hasClass('in-view')) {
          $element.addClass('in-view');
          scroll_anime_number = anime({
            targets: this,
            value: [0, valuefinal],
            round: 1,
            easing: 'easeInOutExpo'
          });
        }
      }
      // else {
      //   $element.removeClass('in-view');
      // }
    })
  };


}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');

// text repeat
const text = document.querySelector('.spa-one');

// const text = document.getElementById("text");

const load = () => {
  const words = "Web Developer | Freelancer";
  text.textContent = "";
  words.split("").forEach((char, index) => {
    setTimeout(() => {
      text.textContent += char;
    }, index * 100); // typing speed
  });
};

load();
setInterval(load, 4000); // repeat




const texto = document.querySelector('.spa-two');

const loadone = () => {
  setTimeout(() => {
    texto.textContent = "";
  }, 0);
  setTimeout(() => {
    texto.textContent = "P";
  }, 300);
  setTimeout(() => {
    texto.textContent = "Pr";
  }, 600);
  setTimeout(() => {
    texto.textContent = "Pra";
  }, 900);
  setTimeout(() => {
    texto.textContent = "Prak";
  }, 1200);
  setTimeout(() => {
    texto.textContent = "Praka";
  }, 1500);
  setTimeout(() => {
    texto.textContent = "Prakas";
  }, 1800);
  setTimeout(() => {
    texto.textContent = "Prakasa";
  }, 2100);
  setTimeout(() => {
    texto.textContent = "Prakasam";
  }, 2400);
  setTimeout(() => {
    texto.textContent = "Prakasam A";
  }, 2700);
}
loadone()
setInterval(loadone, 4000);

// navbar

$(document).ready(function () {
  $(window).bind("scroll", function () {
    var navHeight = $(window).height() - 70;
    if ($(window).scrollTop() > navHeight) {
      $("nav").addClass("fixed");
    } else {
      $("nav").removeClass("fixed");
    }
  });
});


// loader

setTimeout(function () {
  document.querySelector(".drag").style.display = "none";
  document.querySelector(".showall").style.display = "block";
}, 3000);

// loader-end




const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const images = document.querySelectorAll(".project-item img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex1 = 0;

// Open modal on click
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    currentIndex1 = index;
  });
});

// Close modal
closeBtn.onclick = () => modal.style.display = "none";

// Navigate left/right
prevBtn.onclick = () => showImage(currentIndex1 - 1);
nextBtn.onclick = () => showImage(currentIndex1 + 1);

function showImage(index) {
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  modalImg.src = images[index].src;
  currentIndex1 = index;
}

// Close when clicking outside image
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Scroll fade animation
const items = document.querySelectorAll('.scroll-fade');
const revealOnScroll = () => {
  items.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) el.classList.add('visible');
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();


// scroll percentage


$(document).ready(function () {

  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height();
    const winHeight = $(window).height();
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    const scrollPercentRounded = Math.round(scrollPercent);

    $('#scrollPercentLabel span').text(scrollPercentRounded);
  });

});