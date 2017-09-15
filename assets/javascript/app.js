$(document).ready(function () {

    //  CREATE TOPICS

    var topics = ['guardians of the galaxy', 'james bond', 'avengers', 'batman', 'bourne', 'harry potter', 'hunger games', 'lord of the rings'];
    var apiKey = "2412d39e1a784f538091d7b5cc81ecb9";
    var searchLimit = 10;
    var offset = 0;
    var topicName;
    var rating;

    function createTopicBtns() {
        for (var b = 0; b < topics.length; b++) {
            var tBtn = $("<button>");
            tBtn.addClass("btn-topic btn");
            tBtn.append(topics[b]);
            tBtn.attr("value", topics[b].split(' ').join('+'));
            tBtn.attr("type", "button");
            $("#btn-list").append(tBtn);
        }
    }

    createTopicBtns();

    $(".btn-topic").click(topicClick);

    function nextBtnCreation() {
        var nBtn = $("<button>");
        nBtn.addClass("btn btn-next");
        nBtn.append("Next 10  &raquo;");
        nBtn.attr("type", "button");
        $("#pager").append(nBtn);
    }

    function prevBtnCreation() {
        var pBtn = $("<button>");
        pBtn.addClass("btn btn-previous");
        pBtn.append("&laquo;  Previous 10");
        pBtn.attr("type", "button");
        $("#pager").prepend(pBtn);
    }

    function topicClick() {
        // Clear gif div
        $('#gifs').empty();
        $('#pager').empty();
        offset = 0;
        topicName = $(this).attr("value");
        gifSearch();
        nextBtnCreation();
        $(".btn-next").click(next20);
    }

    function next20() {
        if (offset === 0) {
            prevBtnCreation();
            $(".btn-previous").click(prev20);
        }
        offset = offset + searchLimit;
        console.log(offset);
        $('#gifs').empty();
        gifSearch();
    }

    function prev20() {
        offset = offset - searchLimit;
        console.log(offset);
        $('#gifs').empty();
        gifSearch();
        if (offset === 0) {
            $('.btn-previous').detach();
        }
    }

    function gifSearch() {

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + topicName + "&api_key=" + apiKey + "&limit=" + searchLimit + "&offset=" + offset + "";

        console.log(topicName);
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function (response) {
            console.log(response);

            // Create GIFS

            var responseIndex = 0;

            // CREATE IMAGES
            var gifList = $("<ul>");
            gifList.addClass("gif-list");

            for (var a = 0; a < response.data.length; a++) {
                createImg();
                responseIndex++;
            }

            $("#gifs").append(gifList);

            // Reset onclick events
            $(".gif-image").click(gifClick);

            function createImg() {

                var gifImage = $("<img>");

                //
                gifImage.attr("src", "https://i.giphy.com/media/" + response.data[responseIndex].id + "/200w_s.gif").attr("giphyId", response.data[responseIndex].id).attr("status", "static").attr("rating", response.data[responseIndex].rating);
                gifImage.addClass("gif-image");
                var gifRating = $("<p>");

                gifRating.append("<b>Rating:</b> " + response.data[responseIndex].rating + "");
                gifRating.addClass("gif-text");

                var gifListItem = $("<li>");

                gifListItem.addClass("gif-list-item");
                gifListItem.append(gifImage, gifRating);
                gifList.append(gifListItem);
            }
        })
    }

    $(".btn-submit-new-topic").click(function () {

        var newTopic = document.getElementById("new-topic").value;

        // VALIDATIONS
        if (newTopic === "") {
            $('#new-topic-message').html("Error: Topic can't be blank");
        } else if (topics.indexOf(newTopic)>0) {
            console.log("Already exists");
            $('#new-topic-message').html("Error: Topic already exists");
        }
        else {
            // Add new topic to topics array
            topics.push(newTopic);

            // Clear list of current buttons and create new one
            $('#btn-list').empty();
            createTopicBtns();

            // Clear input field
            $('#new-topic').val("");

            // Reset onclick events
            $(".btn-topic").click(topicClick);
        }
    });

    $(".btn-new-topic-clear").click(function () {

            $('#new-topic-message').empty();
            // Clear input field
            $('#new-topic').val("");
    });


    function gifClick() {

        var imgStatus = $(this).attr("status");
        var imgId = $(this).attr("giphyId");

        if (imgStatus === "static") {
            $(this).attr("status", "animated");
            $(this).attr("src", "https://media3.giphy.com/media/" + imgId + "/200w.gif");
        }
        else {
            $(this).attr("status", "static");
            $(this).attr("src", "https://i.giphy.com/media/" + imgId + "/200w_s.gif");
        }
    }
})
;