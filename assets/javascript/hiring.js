// $(function () {

function skillSearch() {
    $(".container").empty();

    //form creating
    if (!($("#skillsForm").length)) {
        var form = $("<form>")
        form.attr({
            class: "form-inline m-2",
            id: "skillsForm"
        })
        var formGroup = $("<div>")
        formGroup.attr("class", "form group")
        var input = $("<input>")
        input.attr({
            class: "form-control mr-2",
            id: "query",
            type: "text"
        })
        var button = $("<button>")
        button.attr({
            class: "btn btn-primary",
            type: "submit",
            id: "search"
        })
        button.append("Submit")
        formGroup.append(input)
        formGroup.append(button)
        form.append(formGroup)
        $(".container").prepend(form)
    }
    var results = $("<div>").attr("id", "results")
    $(".container").append(results)
}
var start;
var noResults = $('<h1 id="noResults" class="text-center display-1"><span class="sadFace">:-(</span><br> No Results Found</h1>')
var noMoreResults = $('<h1 id="noResults" class="text-center display-1">No more results</h1>')
var loading = $('<img id="loading" class="mx-auto d-block" src="assets/images/loading.gif">')
//initial Search
$(document).on("click","#search" ,function () {
    event.preventDefault();
    
    $("#noResults").remove()
    $(".container").append(loading)
    $("#results").empty()
    var query = $("#query").val()
    start = 0;
    callIndeed(query, start)
})
//load more
// $(document).on("click","#more", function(){
//     $("#more").remove()
//     var query = $("#query").val()
//     start +=50
//     callIndeed(query, start)
// })

$(window).scroll(function(){
    if($(window).scrollTop() > ($("html").prop('scrollHeight')-1200))
    {   

        // $("#more").remove()
        var query = $("#query").val()
        start +=50
        callIndeed(query, start)
    }

})
// console.log($(".container").scrollTop())
function callIndeed(query, start) {
    $.ajax({
        url: `https://auth.indeed.com/resumes/?client_id=ee67c8790bfa32ac013a21c622d34d5de0c8be342a7711899d5d9c4cb18b7c4f&l=miami&v=1&q=${query}&start=${start}`,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        $("#loading").remove()
        var datas = response.data.resumes
        console.log(datas.length)
        if (datas.length === 0 && start > 51) {
            console.log("Start is: "+start)
            $("#results").append(noMoreResults)
        }
        else if( datas.length === 0 && start < 51)
        {
            console.log(start)
            $("#results").append(noResults)
        }
        else {
            for (i = 0; i < datas.length; i++) {
                if (datas[i].skillsList.length > 0 && datas[i].firstName != "" && datas[i].lastName != "") {
                    var card = $("<div>")
                    card.attr("class", "card float-left m-2")
                    var cardBody = $("<div>")
                    cardBody.attr({
                        class: "card-body",
                        style: "width: 18rem;"
                    })
                    var buttonDiv = $("<div>")
                    buttonDiv.attr("class", "btn-group")
                    buttonDiv.append('<a class="btn btn-info" href="http://indeed.com' + datas[i].url + '"target="_blank">Resume Profile</a>')
                    buttonDiv.append('<a class="btn btn-primary" href="' + 'https://www.linkedin.com/search/results/index/?keywords=' + datas[i].firstName + '%20' + datas[i].lastName + '"target="_blank">Linked In Search</a>')
                    cardBody.append(buttonDiv)
                    cardBody.append("<h4>" + datas[i].firstName + " " + datas[i].lastName + "</h4>")
                    var list = $("<ul>")
                    for (j = 0; j < datas[i].skillsList.length; j++) {
                        list.append("<li>" + (datas[i].skillsList[j].text).toLowerCase() + " - " + datas[i].skillsList[j].monthsOfExperience + " Months </li>")
                    }
                    cardBody.append(list)
                    card.append(cardBody)

                    $("#results").append(card)
                }//end of if to check theres data in all fields
            }//end of outer forloor
            
            // var more = $("<button>").attr({
            //     class: "btn btn-primary btn-block",
            //     id: "more",
            //     dispalay: "block"
            // })

            // more.append("Load More")
            // $(".container").append(more)
            console.log(start)

        }//End else
    })//end of ajax call then
}//end indeed func

// })//End of doc ready