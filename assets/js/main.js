$(document).ready(function () {
    $('.parallax__list>li').addClass('layer');
    $('.parallax__list').parallax();

    $('.wrapper').addClass('active');
});

const host = "http://f0439912.xsph.ru/api";
const f = async (url, method = 'GET', data = null) => {
    let options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const result = await fetch(host + url, options);

    let response = {
        status: result.status
    }

    try {
        response.json = await result.json();
    } catch {
    }

    return response;
};

let app = new Vue({
    el: '#app',
    data: {
        page: 'index',
        letter: null,
        letter_flag: false,
        notification: false,

        letters: [],

        form: {
            name: null,
            age: null,
            email: null,
            title: null,
            content: null,
            image_path: undefined,
        }
    },
    created() {
        this.loadPage();
        this.loadLetters();
    },
    methods: {
        savePage() {
            localStorage.setItem('page', this.page);
        },
        fileSelected(event) {
            this.form.image_path = event.target.files[0];
        },
        loadPage() {
            const page = localStorage.getItem('page');

            if (page)
                this.page = page;
        },
        go(page) {
            this.page = page;
            this.savePage();
            this.loadLetters();
        },
        async loadLetters() {
            const res = await f('/purpose');
            this.letters = res.json;
        },
        pageLetter(letter) {
            this.letter = letter;
            this.letter_flag = true;
        },
        async sendForm() {
            const _FormData = new FormData()
            for (const key in this.form)
                if (this.form[key])
                    _FormData.append(key,this.form[key])
            const res = await fetch(host + '/purpose', {
                method: 'POST',
                body: _FormData,
            });
            if (res.ok) {
                this.form = {
                    name: null,
                    age: null,
                    email: null,
                    title: null,
                    content: null,
                    image_path: null,
                };
                this.go('view');
                this.notification = true;
            }
        }
    },
});
