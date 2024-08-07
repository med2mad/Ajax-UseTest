const axios = require('axios');

async function login (body, Swal, user){
    const response = await axios.post('http://localhost:5000/login/', body);
    if (response.data.user) {
        localStorage.setItem('token', response.data.token);

        user.name = response.data.user.username;
        user.photo = response.data.user.userphoto;
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userphoto', response.data.user.userphoto);
    }
    else{
        Swal.showValidationMessage(`Wrong UserName or Password`);
        return false; //stop Swal from leaving
    }
}

function logout(user){
    localStorage.removeItem('token');

    user.name = '';
    user.photo = 'profile.jpg';
    localStorage.removeItem('username');
    localStorage.setItem('userphoto', 'profile.jpg');
}


function paginate(totalItems, currentPage = 1, pageSize = 10, maxPages = 10) { //total selected rows count, current page number, per page, max pages
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage, endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };

    //https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
}


module.exports = {login, logout, paginate}