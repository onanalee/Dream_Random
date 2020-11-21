function displayCount() {
    $.ajax({
        type: 'GET',
        url: '/api/count',
        data: {},
        success: function (response) {
            let count = response['count'];
            let showCount = `Number of dreams in the database: ${count}`;
            $('#count').append(showCount);
        }
    })
};

function displayRandomTrue() {
    $.ajax({
        type: 'GET',
        url: '/api/list',
        data: {},
        success: function (response) {
            let randomDream = response['randomTrue'][0];
            let dream = randomDream['dream'];
            let title = randomDream['title'];

            $('#random_dream').empty()
            $('#dream_video').empty()

            let showTextDream = `<div class="randomDream"> Title: ${title} <br>
            Content: ${dream}
             </div> <br><br>`;
            $('#random_dream').append(showTextDream);
        }
    })
};

function displayRandomFalse() {
    $.ajax({
        type: 'GET',
        url: '/api/list',
        data: {},
        success: function (response) {
            let randomDream = response['randomFalse'][0];
            let title = randomDream['title'];
            let url = randomDream['url'];

            $('#random_dream').empty()
            $('#dream_video').empty()

            let videoID = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
            let imgID = url.match(/https?:\/\/.+\.(jpg|gif|png)/);

            if (videoID != null) {
                console.log("video id = ", videoID[1]);
                let showVideo = `<div class="randomDream"> <div>Title: ${title}</div><iframe width="1000" height="562"
                src="https://www.youtube.com/embed/${videoID[1]}"></iframe></div>`;
                $('#dream_video').append(showVideo);
            } else if (imgID != null) {
                console.log("This is img url.");
                let showImgDream = `<div class="randomDream"> Title: ${title} <br>
             <img src="${url}" />
             </div> <br><br>`;

                $('#random_dream').append(showImgDream);
            } else {
                console.log("recursive: " + url);
                displayRandomFalse();
            }
        }
    });
}


function openClose() {
    if ($('#submissionBox').css('display') == 'none') {
        $('#submissionBox').show()
        $('#submissionButton').text('Close Submit Box')
    } else {
        $('#submissionBox').hide()
        $('#submissionButton').text('Open Submit Box')
    }
}


function submitDream() {

    let title = $("#dreamTitle").val();

    let dream = $("#dreamContent").val();


    if (title == "") {
        alert("Please enter the title");
        $("#dreamTitle").focus();
        return;
    } else if (dream == "") {
        alert("Please enter your dream");
        $("#dreamContent").focus();
        return;
    }

    $.ajax({
        type: "POST",
        url: "/review",
        data: {title_give: title, dream_give: dream},
        success: function (response) {
            if (response["result"] == "success") {
                alert("Successfully uploaded to the dream database!");
                window.location.reload();
            }
        }
    })
};

$(document).keyup(function(event) {
    if ($("#search").is(":focus") && event.key == "Enter") {
        submitSearch();
    }
});

function submitSearch() {
    let search = $("#search").val();
    if (search == "") {
        alert("Please enter search keyword");
        $("#search").focus();
        return;
    }

    $.ajax({
        type: "GET",
        url: "/search",
        data: {'search_give': search},
        success: function (response) {
            if (response["result"] == "success") {
                console.log(response['search']);
                displaySearch(response);
            }
        }
    })
}

function displaySearch(response) {
    $('#random_dream').empty();
    let dreams = response['search'];

    for (let i = 0; i < dreams.length; i++) {
        let dream = dreams[i];

        let showSearch = `<div class="randomDream"><button id="searchResult" onclick="showContent(this)">${dream['title']}</button> <div class="content">${dream['dream']}</div></div><br>`;
        console.log(dream['title']);
        $('#random_dream').append(showSearch);
        $('.content').hide();
    }
}

function showContent(e) {
    let content = $(e).siblings('.content');
    //let content = $(e).parent().children('.content')
    /*if (content.css('display') == 'none'){
        content.show();
    } else {
        content.hide();
    }*/
    content.toggle();
}


// *** TO BE CUSTOMISED ***

var style_cookie_name = "style";
var style_cookie_duration = 30;
var style_domain = "thesitewizard.com";

// *** END OF CUSTOMISABLE SECTION ***
// You do not need to customise anything below this line

function switch_style(css_title) {
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// https://www.thesitewizard.com/javascripts/change-style-sheets.shtml
    var i, link_tag;
    for (i = 0, link_tag = document.getElementsByTagName("link");
         i < link_tag.length; i++) {
        if ((link_tag[i].rel.indexOf("stylesheet") != -1) &&
            link_tag[i].title) {
            link_tag[i].disabled = true;
            if (link_tag[i].title == css_title) {
                link_tag[i].disabled = false;
            }
        }
        set_cookie(style_cookie_name, css_title,
            style_cookie_duration, style_domain);
    }
}

function set_style_from_cookie() {
    var css_title = get_cookie(style_cookie_name);
    if (css_title.length) {
        switch_style(css_title);
    }
}

function set_cookie(cookie_name, cookie_value,
                    lifespan_in_days, valid_domain) {
    // https://www.thesitewizard.com/javascripts/cookies.shtml
    var domain_string = valid_domain ?
        ("; domain=" + valid_domain) : '';
    document.cookie = cookie_name +
        "=" + encodeURIComponent(cookie_value) +
        "; max-age=" + 60 * 60 *
        24 * lifespan_in_days +
        "; path=/" + domain_string;
}

function get_cookie(cookie_name) {
    // https://www.thesitewizard.com/javascripts/cookies.shtml
    var cookie_string = document.cookie;
    if (cookie_string.length != 0) {
        var cookie_array = cookie_string.split('; ');
        for (i = 0; i < cookie_array.length; i++) {
            cookie_value = cookie_array[i].match(cookie_name + '=(.*)');
            if (cookie_value != null) {
                return decodeURIComponent(cookie_value[1]);
            }
        }
    }
    return '';
}