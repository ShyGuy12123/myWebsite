let open = true;

function tsw_expand_navmenu() {

    if (open) {

        document.getElementById('tswcssbuttons').classList.remove('active');

        document.getElementById('tswhamburger').classList.remove('active');

        open = false;

    } else {

        open = true;

        document.getElementById('tswcssbuttons').classList.add('active');

        document.getElementById('tswhamburger').classList.add('active');
    }

}
