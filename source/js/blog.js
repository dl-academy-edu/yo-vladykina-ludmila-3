// фильтр
(function() {
    const MONTHS = ["Январь", "Февраль", "Март", "Апр.", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    (function() {
    let date = new Date();

    console.log(`${date.getDate()} число. Месяц:${MONTHS[date.getMonth()]}. Год:${date.getFullYear()} `);
    })();

    const server = 'https://academy.directlinedev.com';
    const preloaderFilter = document.querySelector('.filter-preloader-js');
    const buttonPrev = document.querySelector('.pagination__button_prev-js');
    const buttonNext = document.querySelector('.pagination__button_next-js');

    (function() {
        const form = document.forms.filter;
        closePreloader(preloaderFilter);
        form.addEventListener('submit', function (e) {
            pagenationButtonHide();
            openPreloader(preloaderFilter);
            e.preventDefault();
            
            let data = {
                page: 0,
            };

            data.searchFilter = form.elements.searchFilter.value;

            data.tags = [...form.elements.tags].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

            data.views = ([...form.elements.views].find(radio => radio.checked) || {value: null}).value;

            data.comments = [...form.elements.comments].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

            data.show =([...form.elements.show].find(radio => radio.checked) || {value: null}).value;

            data.sort = ([...form.elements.sort].find(radio => radio.checked) || {value: null}).value;

            getData(data);

            setSearchParams(data);
        });

        form.addEventListener('reset', function() {
            history.replaceState(null, document.title, location.pathname);
        })
        
        sendRequest ({
            method: 'GET',
            url: `${server}/api/tags`,
            onload: ( { xhr } ) => {
                if (xhr.status === 200) {

                    const tags = JSON.parse(xhr.response).data;
                    const boxTags = document.querySelector('.filter__tags');
                    
                    tags.forEach(tag => {
                        const tagHTML = createTag(tag);
                        boxTags.insertAdjacentHTML('beforeend', tagHTML);
                    }) 

                    const params = getParamsFromLocation();

                    setDataFilter(params);

                    getData(params);
                }

            }
        })
    })();

    // функция запроса
    function sendRequest({method, url, onload}) {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);
        xhr.send();
        xhr.onload = () => onload ( { xhr } );
    }

    // получаем значения из фильтра
    function getParamsFromLocation() {
        let searchParams = new URLSearchParams(location.search);
        return {
            searchFilter: searchParams.get('searchFilter') || '',
            tags: searchParams.getAll('tags'),
            views: searchParams.get('views') || "500-1000",
            comments: searchParams.getAll('comments'),
            show: searchParams.get('show') || "5",
            sort: searchParams.get('sort') || "date",
            page: +searchParams.get('page') || 0,
        };
        
    }

    // вставляем данные в фильтр  (data - данные search параметров из getParamsFromLocation)
    function setDataFilter(data) {
        const form = document.forms.filter;

        form.elements.searchFilter.value = data.searchFilter;

        form.elements.tags.forEach(checkbox => {
            checkbox.checked = data.tags.includes(checkbox.value);
        });

        form.elements.views.forEach(radio => {
            radio.checked = data.views === radio.value;
        });

        form.elements.comments.forEach(checkbox => {
            checkbox.checked = data.comments.includes(checkbox.value);
        });

        form.elements.show.forEach(radio => {
            radio.checked = data.show === radio.value;
        });

        form.elements.sort.forEach(radio => {
            radio.checked = data.sort === radio.value;
        });
    }

    // функция выставляющая значения внутрь наших search параметров в соответствии с тем что в нее было передано
    function setSearchParams(data) {
        let searchParams = new URLSearchParams();

        searchParams.set('searchFilter', data.searchFilter);

        data.tags.forEach(item => {
            searchParams.append('tags', item);
        });
        
        if (data.views) {
            searchParams.set('views', data.views);
        }

        data.comments.forEach(item => {
            searchParams.append('comments', item);
        });

        if(data.show) {
            searchParams.set('show', data.show);
        }
        
        if(data.sort) {
            searchParams.set('sort', data.sort);
        } 

        if (data.page) {
            searchParams.set('page', data.page);
        } else {
            searchParams.set('page', 0);
        }
        
        history.replaceState(null, document.title, '?' + searchParams.toString());
    }

    // создание и вывод постов и пагинации
    function getData(params) {
        const result = document.querySelector('.post');

        let xhr = new XMLHttpRequest();
        let searchParams = new URLSearchParams();

        searchParams.set('v', '1.0.0');
        if(params.tags && Array.isArray(params.tags) && params.tags.length) {
            searchParams.append('tags', JSON.stringify(params.tags));
        }
        let filter = {};
        if (params.searchFilter) {
            filter.title = params.searchFilter;
        }
        if (params.views) {
            filter.views = {$between: params.views.split('-')};
        }
        if (params.comments.length) {       
            filter.commentsCount = {"$between": [params.comments[0].split('-')[0], params.comments[params.comments.length-1].split('-')[1]]};
        }
        if(+params.page) {
            searchParams.set('offset', +params.page * params.show);
        }
        searchParams.set('filter', JSON.stringify(filter));
        searchParams.set('limit', params.show);
        if (params.sort) {
            searchParams.set('sort', JSON.stringify([params.sort, 'ASC']))
        }
        
        xhr.open('GET', server + '/api/posts?' + searchParams.toString());
        xhr.send();
        result.innerHTML = '';
        const links = document.querySelector('.pagination__page');
        links.innerHTML = '';
        xhr.onload = () => {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.response).data;
                const responseCount = JSON.parse(xhr.response).count;
                let dataPosts = '';
                responseData.forEach(post => {
                    dataPosts += createPost({
                        title: post.title, 
                        text: post.text, 
                        src: post.photo.desktopPhotoUrl, 
                        commentsCount: post.commentsCount,
                        date: post.date,
                        views: post.views,
                        tags: post.tags,
                    });
                })
                result.innerHTML = dataPosts;

                const pageCount = Math.ceil(responseCount / params.show);
                for (let i = 0; i < pageCount; i++) {
                    const link = createLink(i);
                    links.insertAdjacentElement('beforeend', link);
                }
                pagenationButtonHide(pageCount);

                buttonNext.addEventListener('click', () => {
                    paginationMove(params.page + 1);
                    
                });
            
                buttonPrev.addEventListener('click', () => {
                    paginationMove(getParamsFromLocation().page - 1);
                });

                closePreloader(preloaderFilter);
            }
            
            
        }
    }

    // создание тэгов
    function createTag({id, color}) {
        let checked = '';
        if (id === 1 || id === 6) {
            checked = 'checked';
        }
        return `<li>
            <label for="color-${id}" class="filter__label filter__label_tag">
                <input id="color-${id}" class="filter__input" type="checkbox" name="tags" value="${id}" ${checked}>
                <span class="filter__input-checkbox filter__input-checkbox_tags filter__input-checkbox_${id}" style="border-color:${color}"></span>
            </label>
        </li>`
    }

    //создание постов
    function createPost({title, text, src, commentsCount, date, views, tags}) {
        let postsDate = new Date(date);

        let dayDate = (postsDate.getDate()) < 10 ? "0"+postsDate.getDate() : postsDate.getDate();
        let monthDate = (postsDate.getMonth()) < 10 ? "0"+postsDate.getMonth() : postsDate.getMonth();
        let dateToPost = `${dayDate}.${monthDate}.${postsDate.getFullYear()} `;

        let dataTags = '';

        tags.forEach (data => {
            dataTags += `<span class="post__tag" style="background-color:${data.color}"></span>`;
        });


        return`
        <div class="post__item">
            <img class="article__img" src="${server}${src}" alt="${title}" />
            <div class="post__wrapper">
                <div class="post__tags">${dataTags}</div>
                <div class="post__info">
                    <span class="post__date">${dateToPost}</span>
                    <span class="post__views">${views} views</span>
                    <span class="post__comments">${commentsCount} Comments</span>
                </div>
                <h3 class="post__title">${title}</h3>
                <p class="post__description">${text}</p>
                <a class="post__link" href="#">Go to this post</a>
            </div>
        </div>`
    }

    // создание ссылок пагинации
    function createLink(page) {
        const link = document.createElement('a');

        link.href = '?page=' + page;
        link.innerText = (page + 1);
        link.classList.add('pagination__link');

        let params = getParamsFromLocation();

        if(page === +params.page) {
            link.classList.add('pagination__link_active');
        }

        link.addEventListener('click', (e) => {
            openPreloader(preloaderFilter);
            pagenationButtonHide();
            e.preventDefault();

            const links = document.querySelectorAll('.pagination__link');
            let searchParams = new URLSearchParams(location.search);
            let params = getParamsFromLocation();

            links[params.page].classList.remove('pagination__link_active');
            searchParams.set('page', page);
            links[page].classList.add('pagination__link_active');

            history.replaceState(null, document.title, '?' + searchParams.toString());

            getData(getParamsFromLocation());
    });
    return link;
    }

    function pagenationButtonHide(data) {
        if (!data) {
            buttonPrev.classList.add('common-visually-hidden');
            buttonNext.classList.add('common-visually-hidden');
        } else {
            buttonPrev.classList.remove('common-visually-hidden');
            buttonNext.classList.remove('common-visually-hidden');
        }
    }

    function paginationMove(page) {
        const links = document.querySelectorAll('.pagination__link');
        let searchParams = new URLSearchParams(location.search);
        let params = getParamsFromLocation();
        buttonNext.disabled = false;
        buttonPrev.disabled = false;
        if (params.page >= page-1) {
            buttonNext.disabled = true;
        } else {
            buttonNext.disabled = false;
        }
        
        if (params.page === 0) {
            buttonPrev.disabled = true;
        } else {
            buttonPrev.disabled = false;
        }

        links[params.page].classList.remove('pagination__link_active');
        searchParams.set('page', page);
        links[page].classList.add('pagination__link_active');

        history.replaceState(null, document.title, '?' + searchParams.toString());

        getData(getParamsFromLocation());
    }
})();



