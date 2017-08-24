// JQuery plugin for querying NYTimes API

$.fn.nytimes = function (url, api_key) {
'use strict';

    const mainContainerTpl = `<div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="header">NY Times articles query</h2>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <input id="token" size="40" type="text">
                    <button id="searchButton">Search in archive</button>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12" id="results"></div>
           </div>
        </div>`;

    this.html(mainContainerTpl);

    this.find('#searchButton').click(function () {
        getArticles();
    });

    const getArticles = ()  =>{
        let requestUrl = url + '?' + $.param({
            'api-key': api_key,
            'q': this.find('#token').val()
        });

        $.ajax({
            url: requestUrl,
            method: 'GET',
            dataType: 'json',
            success: processResults
        });
    };

    const processResults = (data) => {

        this.find('#table').remove();
        this.find('#results').append('<table id="table"></table>');

        let dateOfArticle, dateFormatted;
        let dataset = [], dataLine = [];

        for (let article of data.response.docs) {
            dateOfArticle = new Date(article.pub_date);
            dateFormatted = dateOfArticle.getMonth() + '/' + dateOfArticle.getDate() + '/' + dateOfArticle.getFullYear();

            dataLine = [dateFormatted, article.document_type, `<a target="_blank" href="${article.web_url}">${article.headline.main}</a>`];
            dataset.push(dataLine);
        }

        $('#table').DataTable( {
            data: dataset,
            columns: [
                { title: "Publication date" },
                { title: "Document Type" },
                { title: "Headline (link to article)" }
            ],
            "paging":   false,
            "ordering": false,
            "info":     false,
            "searching": false
        } );
    };

};
