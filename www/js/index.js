/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// init Materialize
M.AutoInit();

// Carregar notícies al tab1
document.addEventListener('DOMContentLoaded', function() {
  const loadBtn = document.getElementById('load-news-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      fetchHeadlinesList();
    });
  }
});

function fetchHeadlinesList() {
  const headlinesList = $('#headlines-list');
  headlinesList.html('<div class="progress"><div class="indeterminate"></div></div>');
  $.ajax({
    method: "GET",
    url: "https://api.spaceflightnewsapi.net/v4/articles/?_limit=15",
    dataType: "json"
  }).done(function (data) {
    headlinesList.empty();
    if (data.results && data.results.length > 0) {
      data.results.forEach(function(article) {
        const item = $('<a></a>')
          .addClass('collection-item')
          .attr('href', '#!')
          .text(article.title)
          .data('articleId', article.id)
          .on('click', function(e) {
            e.preventDefault();
            loadArticleDetails(article.id);
          });
        headlinesList.append(item);
      });
    } else {
      headlinesList.html('<span class="collection-item">No s\'han trobat notícies.</span>');
    }
  }).fail(function () {
    headlinesList.html('<span class="collection-item red-text">Error carregant notícies.</span>');
  });
}

// Carregar detall de notícia i salta a tab2
function loadArticleDetails(articleId) {
  const detailsDiv = $('#article-details');
  detailsDiv.html('<div class="progress"><div class="indeterminate"></div></div>');
  $.ajax({
    method: "GET",
    url: `https://api.spaceflightnewsapi.net/v4/articles/${articleId}/`,
    dataType: "json"
  }).done(function(article) {
    let html = '';
    html += `<h4>${article.title}</h4>`;
    if (article.image_url) {
      html += `<div class='center-align'><img src='${article.image_url}' alt='${article.title}' style='max-width:100%;height:auto;margin-bottom:1em;'/></div>`;
    }
    if (article.summary) {
      html += `<p>${article.summary}</p>`;
    }
    if (article.published_at) {
      const date = new Date(article.published_at).toLocaleString();
      html += `<p class='grey-text'>Publicat: ${date}</p>`;
    }
    if (article.url) {
      html += `<p><a href="#" onclick="window.open('${article.url}', '_system'); return false;">Notícia original</a></p>`;
    }
    detailsDiv.html(html);

    // Saltar a tab2
    var elems = document.getElementsByClassName('tabs');
    var instance = M.Tabs.getInstance(elems[0]);
    instance.select('image-test2');
  }).fail(function() {
    detailsDiv.html('<span class="red-text">Error carregant la notícia.</span>');
  });
}

// Carregar notícies a tab3 amb Materialize Cards
document.addEventListener('DOMContentLoaded', function() {
  const loadCardsBtn = document.getElementById('load-cards-btn');
  if (loadCardsBtn) {
    loadCardsBtn.addEventListener('click', function() {
      fetchNewsCards();
    });
  }
});

function fetchNewsCards() {
  const cardsRow = $('#news-cards-row');
  cardsRow.html('<div class="progress"><div class="indeterminate"></div></div>');
  $.ajax({
    method: "GET",
    url: "https://api.spaceflightnewsapi.net/v4/articles/?_limit=12",
    dataType: "json"
  }).done(function(data) {
    cardsRow.empty();
    if (data.results && data.results.length > 0) {
      data.results.forEach(function(article) {
        const col = $('<div></div>').addClass('col s12 m6 l4');
        col.html(`
          <div class="card medium">
            <div class="card-image">
              <img src="${article.image_url || ''}" alt="${article.title}" style="object-fit:cover;height:180px;">
              <span class="card-title" style="background:rgba(0,0,0,0.5);padding:0 0.5em;">${article.title}</span>
            </div>
            <div class="card-content">
              <p>${article.summary ? article.summary.substring(0, 100) + '...' : ''}</p>
            </div>
            <div class="card-action">
              <a href="#" onclick="window.open('${article.url}', '_system'); return false;">Notícia original</a>
              <a href="#" onclick="loadArticleDetails(${article.id}); return false;">Veure detall</a>
            </div>
          </div>
        `);
        cardsRow.append(col);
      });
    } else {
      cardsRow.html('<span class="red-text">No s\'han trobat notícies.</span>');
    }
  }).fail(function() {
    cardsRow.html('<span class="red-text">Error carregant notícies.</span>');
  });
}