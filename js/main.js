//Use Strict Mode
const dbRef = firebase.firestore();
const defaultStorage = firebase.storage();
(function ($) {
  "use strict";

  //Begin - Window Load
  $(window).load(function () {

    //==============___Page Loader___================

    $('#page-loader').delay(300).fadeOut(400, function () {

    });

    $('#loader-name').addClass('loader-left');
    $('#loader-job').addClass('loader-right');
    $('#loader-animation').addClass('loader-hide');

  });

  //Begin - Document Ready
  $(document).ready(function () {
    LoadtoPage();
    LoadSchoolData();
    LoadWorkExpData('WorkExp', 'job');
    LoadWorkExpData('Volunteering', 'volt');
    LoadSkills('langskill', 'lang');
    LoadSkills('frameskill', 'frame');
    LoadSkills('technologies', 'tech');
    LoadProjects();
    $(".project-thumbnail").on('click', function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
      alert('clicked');
    });
    //==============___Page Loader___================
    $('#loading-wraper').fadeIn(300);

    //==============___Testimonials - owl Carousel___================
    $("#testimonial-carousel").owlCarousel({
      navigation: false, // Show next and prev buttons
      slideSpeed: 300,
      paginationSpeed: 400,
      responsiveRefreshRate: 200,
      responsiveBaseWidth: window,
      pagination: true,
      singleItem: true,
      navigationText: ["<span class='fa fa-chevron-left'></span>", "<span class='fa fa-chevron-right'></span>"],
    });


    //==============_Map_================
    $('.map').on('click', function () {
      $('.map-overlay').hide();
    });

    $('.map').on('mouseleave', function () {
      $('.map-overlay').show();
    });

    //==============_Lightbox_================
    //Nivo Lightbox
    $('a.nivobox').nivoLightbox({ effect: 'fade' });


    //==============___Scrollbars___================
    $('.section-vcardbody').perfectScrollbar({
      wheelSpeed: 0.9
    });

    //==============___Menu & Pages Animation___================

    var linkHome = 0;
    var linkPage = '';

    function pageOn() {
      $('#main-menu').addClass('main-menu-pgactive');
      $('#section-home').addClass('section-vcardbody-pgactive');
      $('.profileActive').removeClass('profileActive');
      $('#profile2').addClass('profileActive');

      linkHome = 1;
    }

    function pageOff() {
      $('.section-page-active').removeClass('section-page-active');
      $('#main-menu').removeClass('main-menu-pgactive');
      $('#section-home').removeClass('section-vcardbody-pgactive');
      $('.profileActive').removeClass('profileActive');
      $('#profile1').addClass('profileActive');
      linkHome = 0;
    }

    function LoadtoPage() {
      const pagelink = window.location.hash;
      $('.menuActive').removeClass('menuActive');
      $(pagelink + '-ref').addClass('menuActive');
      $('.section-page-active').removeClass('section-page-active');
      $(pagelink).addClass('section-page-active');
      console.log(pagelink);
      if (pagelink != '#page-home' && pagelink != '')
        pageOn();
      console.log("school Data Loading");
    }

    $(".link-page").on('click', function (event) {
      console.log(event);
      //event.preventDefault();
      $('.menuActive').removeClass('menuActive');
      $(this).addClass('menuActive');
      linkPage = $(this).attr('href');
      $('.section-page-active').removeClass('section-page-active');
      $(linkPage).addClass('section-page-active');
      pageOn();
    });


    $(".link-home").on('click', function (event) {
      //event.preventDefault();

      if (linkHome == 0) {
        pageOn();
      }
      else if (linkHome == 1) {
        $('.menuActive').removeClass('menuActive');
        $(this).addClass('menuActive');
        pageOff();
      }
    });

    //==============___Blog - Ajax___================
    function loadPost() {
      $.ajax({
        url: 'single.html', // URL HERE
        type: 'GET',
        success: function (html) {

          var $lis = $(html).find('#blogPost'); // Loads the content inside #blogPost div

          $("#postHere").html($lis);
        }
      });
    }

    $(".loadPost").on('click', function (event) {
      event.preventDefault();
      //$("#postHere").html('loading...');
      $('.section-page-active').removeClass('section-page-active');
      $('#page-blog-single').addClass('section-page-active');
      pageOn();
      loadPost();
    });

    //==============___Contact Form Validator and Ajax Sender___================
    $("#contactForm").validate({
      submitHandler: function (form) {
        $.ajax({
          type: "POST",
          url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdwIoNSiPyeGCR_l46Qs3JE7kWHOUQRYAZA_V0SR4VBElItQg/formResponse",
          data: {
            "entry.83931914": $("#contactForm #name").val(),
            "entry.1222124018": $("#contactForm #email").val(),
            "entry.405353643": $("#contactForm #subject").val(),
            "entry.1102463223": $("#contactForm #message").val()
          },
          contentType: "application/javascript;charset=utf-8",
          dataType: 'jsonp',
          crossDomain: true,
          complete: function (xhr, textStatus) {
            console.log(xhr.status);
          },
          error: function (error) {
            alert('error; ' + eval(error));
          },
          success: function (data, textStatus, xhr) {
            console.log(xhr.status);
            if (data.response == "success") {
              alert('data gone');
              $("#contactSuccess").fadeIn(300);
              $("#contactError").addClass("hidden");

              $("#contactForm #name, #contactForm #email, #contactForm #subject, #contactForm #message")
                .val("")
                .blur()
                .closest(".control-group")
                .removeClass("success")
                .removeClass("error");

            } else {
              alert("failed");
              $("#contactError").fadeIn(300);
              $("#contactSuccess").addClass("hidden");
            }
          }

        });
      }
    });


    //Modal for Contact Form
    $('.modal-wrap').click(function () {
      $('.modal-wrap').fadeOut(300);
    });

    //End - Document Ready
  });

  //End - Use Strict mode
})(jQuery);

async function LoadSchoolData() {
  var codes = ``;
  dbRef.collection("Education").orderBy('id', 'asc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      codes += `<div class="resume-item">
      <!-- Graduation title -->
                <h3 class="section-item-title-1">${doc.data().Subject}</h3>
                <!-- /Graduation title -->
                <!-- Graduation time -->
                <h4 class="graduation-time">${doc.data().SchoolName} - <span class="graduation-date">Graduation ${doc.data().GraduationYear}</span></h4>
                <!-- /Graduation time -->
                <!-- content -->
                <div class="graduation-description">
                  <p>
                  ${doc.data().Description}
                  </p>
                </div>
                <!-- /Content -->
    </div>`;
    });
    document.getElementById("edu").innerHTML += codes;
  });

}

async function LoadWorkExpData(schema, divid) {
  var codes = ``;
  var querySnapshot = await dbRef.collection(schema).orderBy('id', 'asc').get();
  for (const doc of querySnapshot.docs) {
    var options = { year: 'numeric', month: 'long' };
    var totalTime = (new Date() - doc.data().StartDate.toDate());
    codes += `<div class="resume-item">
      <!-- Work Place -->
                <h3 class="section-item-title-1">${doc.data().WorkPlace}</h3>
                <!-- /Work Place -->
                <!-- Job Time -->
                <h4 class="job">${doc.data().Designation} - <span class="job-date">${doc.data().StartDate.toDate().toLocaleDateString("en-US", options)} - ${doc.data().IsCurrent ? 'Current' : doc.data().EndDate.toDate().toLocaleDateString("en-US", options)}
                (${totalTime} months)</span></h4>
                <!-- /Job Time-->
                <!-- content -->
                <div class="graduation-description">
                <ul>`;
    var schemaRef = dbRef.collection(schema).doc(doc.id);
    var qs = await dbRef.collection("Tasks").where('workId', '==', schemaRef).get();
    for (const docu of qs.docs) {
      codes += `<li>${docu.data().taskDesc}</li>`;
    }
    codes += `</ul>
              </div>
              <!-- /Content -->
  </div>`;
    //console.log(codes);
  }
  document.getElementById(divid).innerHTML += codes;
  console.log(codes);
}

async function LoadSkills(divid, type) {
  var codes = ``;
  var querySnapshot = await dbRef.collection('Skill')
    .where('type', '==', type).orderBy('id', 'asc').get();
  var i = 0;
  for (const doc of querySnapshot.docs) {
    i++;
    var prog = i % 3;
    if (prog == 0)
      var prostr = 'progress-bar-3';
    else
      var prostr = `progress-bar-${prog}`;
    codes += `<li><div class="progress">				  
    <div class="progress-bar ${prostr}" role="progressbar" 
    data-percent="${doc.data().percent}%" style="width: ${doc.data().percent}%;">
<span class="sr-only">${doc.data().percent}% Complete</span>
</div>
<span class="progress-icon"><i style="font-size: 28px !important;padding-bottom: 1%;padding-bottom: 1px;" class="${doc.data().devicon}">
</i></span>

<span class="progress-type">${doc.data().lang}</span>
    <span class="progress-completed">${doc.data().percent}%</span>
  </div></li>`;
  }
  document.getElementById(divid).innerHTML += codes;
}

async function LoadProjects() {
  var codes = ``;
  var querySnapshot = await dbRef.collection('Projects').orderBy('id', 'asc').get();
  var i = 0;
  for (const doc of querySnapshot.docs) {
    const imageurl = await imageUrl(doc.data().thumbimage);
    codes += `<div class="project-item">
    <!-- ==> Put your thumbnail as a background -->
    <a 
      onclick="${doc.data().onclick}" class="project-thumbnail nivobox" data-lightbox-gallery="portfolio"
      style="background-image: url('${imageurl}');">
      <!-- project-description -->
      <div class="project-description-wrapper">
        <div class="project-description">
          <!-- project name -->
          <h2 class="project-title">${doc.data().name}</h2>
          <!-- /project name -->
          <span class="see-more">${doc.data().tags}</span>
        </div>
      </div>
      <!-- /project-description -->
    </a>
    <img id="arrow" src="https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-128.png">
    <div class="project-box">
      <p class="project-text-description">${doc.data().description}</p>
      <h4>Used Technologies</h4>
      <ul>`;
    var techs = doc.data().techs.split(',');
    for (const tech of techs) {
      codes += `<li>${tech}</li>`;
    }
    codes += `</ul>
    <div class="blog-item-link">
                    <a onclick="${doc.data().onclick}" class="btn btn-default loadPost">See More</a>
                </div>
    </div>

  </div>`;
  }
  document.getElementById('projects').innerHTML += codes;
}

async function imageUrl(imageName) {
  if(imageName.includes('http'))
    return imageName;
  var storageRef = defaultStorage.ref();
  const url = await storageRef.child(`/${imageName}`).getDownloadURL();
  return url;
}
// async function LoadStory(){
//   $.get( "https://www.google.com/search?igu=1", function( data ) {
//     $( "devstor" ).html( data );
//     alert( "Load was performed." );
//   });
// }
function LoadStory() {
  $.ajax({
    url: 'single.html', // URL HERE
    type: 'GET',
    crossDomain: true,
    success: function (html) {

      var data = $(html).find('#form-section-PersonalInfo'); // Loads the content inside #blogPost div

      $("#devstor").html(data);
    }
  });
}

$(function () {
  var mediumPromise = new Promise(function (resolve) {
  var $content = $('#jsonContent');
  var data = {
      rss: 'https://medium.com/feed/lazyfahim'
  };
  $.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Flazyfahim', data, function (response) {
      if (response.status == 'ok') {
          var output = `<div class="blog-posts">`;
          $.each(response.items, function (k, item) {
              var tagIndex = item.description.indexOf('<img'); // Find where the img tag starts
              var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
              var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
              var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
              var src = item.description.substring(srcStart, srcEnd); // Extract just the URL
              // output += `<img src="${src}" class="card-img-top" alt="Cover image">`;
              // output += `<div class="card-body">`;
              // output += `<h5 class="card-title"><a href="${item.link}">${item.title}</a></h5>`;
              var yourString = item.description.replace(/<img[^>]*>/g,""); //replace with your string.
              yourString = yourString.replace('h4', 'p');
              yourString = yourString.replace('h3', 'p');
              var maxLength = 120; // maximum number of characters to extract
              //trim the string to the maximum length
              var trimmedString = yourString.substr(0, maxLength);
              //re-trim if we are in the middle of a word
              trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
              // output += `<p class="card-text">${trimmedString}...</p>`;
              // output += `<a href="${item.link}" class="btn btn-outline-success">Read More</a>`;
              // output += '</div></div>';
              output += `<div class="blog-item">
              <div class="blog-item-wrapper">
                  <!-- blog item thumbnail -->
                  <div class="blog-item-thumb">
                      <a href="${item.link}"  target="_blank" class="loadPost"><img src="${src}" alt=""></a>
                  </div>
                  <!-- /blog item thumbnail -->
                  <!-- Blog item - infos -->
                  <div class="blog-item-infos">
                      <!-- blog-item-title -->
                      <div class="blog-item-title-wrapper">
                          <h2 class="blog-item-title title-border"><a href="${item.link}"
                          target="_blank"  class="loadPost">${item.title}</a></h2>
                      </div>
                      <!-- /blog-item-title -->
                      <!-- blog item - description -->
                      <div class="blog-item-description">
                          <p><a href="${item.link}" target="_blank" class="loadPost">${trimmedString}....</a></p>
                      </div>
                      <!-- /blog-item-description -->
                      <!-- blog item - link -->
                      <div class="blog-item-link">
                          <a href="${item.link}" target="_blank" class="btn btn-default loadPost">See More</a>
                      </div>
                      <!-- /blog item - link -->
                  </div>
                  <!-- /blog item - infos -->
              </div>
          </div>`;
              return k < 10;
          });
          resolve($content.html(output));
      }
  });
  });

mediumPromise.then(function()
  {
      //Pagination
      pageSize = 3;

      var pageCount = $(".blog-item").length / pageSize;

      for (var i = 0; i < pageCount; i++) {
          $("#pagin").append(`<li class="page-item"><a class="page-link" href="#">${(i + 1)}</a></li> `);
      }
      $("#pagin li:nth-child(1)").addClass("active");
      showPage = function (page) {
          $(".blog-item").hide();
          $(".blog-item").each(function (n) {
              if (n >= pageSize * (page - 1) && n < pageSize * page)
                  $(this).show();
          });
      }

      showPage(1);

      $("#pagin li").click(function () {
          $("#pagin li").removeClass("active");
          $(this).addClass("active");
          showPage(parseInt($(this).text()))
      });
  });
});


