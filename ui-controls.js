/******************************************************************************
navigation functionality
******************************************************************************/
function opentaskBar() {
    var taskBar = document.getElementById('taskBar');
    if (taskBar.style.right === '0px') {
        taskBar.style.right = '-250px'; // Hide task bar
    } else {
        taskBar.style.right = '0px'; // Show task bar
    }
}

function openNav() {
    document.getElementById("toolBar").style.width = "500px";
    document.getElementById("mainPage").style.marginLeft = "500px";
}

function closeNav() {
    document.getElementById("toolBar").style.width = "0";
    document.getElementById("mainPage").style.marginLeft = "0";
}

function openTab(tabName, elmnt, color) {
    /* default hide tab elements */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // For tablinks and buttons removing the background color
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // display tab content
    document.getElementById(tabName).style.display = "block";
}
