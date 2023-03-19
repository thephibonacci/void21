$("html").ready(() => {
    window.onresize = run
    run();

    function run() {
        initialHeight();
        sideBarConfig();
    }

    $("#btn-side-bar").on("click", function () {
        let parent = $(".parent-side-bar");
        parent.toggleClass('active-side-bar')
        if (parent.hasClass("active-side-bar")) {
            $(".side-bar-txt-item").hide()
            $(".logo").hide()
        } else {
            $(".side-bar-txt-item").show()
            $(".logo").show()
        }
    })
    const ctx2 = document.getElementById("chart2").getContext('2d')
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: [
                'Blue',
                'Yellow',
                'Red'
            ],
            datasets: [{
                label: ' ',
                data: [300, 100, 30],
                backgroundColor: [
                    '#2B76E9',
                    '#FFD500',
                    'red'
                ],
                borderColor: "#282c3a",
                hoverOffset: 3
            }],
            options: {
                maintainAspectRatio: false,
                responsive:true,
                resizeDelay:0
            },
        }
    });
    const ctx = document.getElementById('chart').getContext('2d');
    Chart.defaults.font.size = 14;
    Chart.defaults.color = '#999999';
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', "7", "8", "9"],
            datasets: [{
                label: 'test',
                data: [5, 1, 3, 5, 6, 4, 6, 5, 8],
                borderColor: [
                    '#2B76E9'
                ],
                borderWidth: 3,
                tension: 0.1
            }, {
                label: 'test-2',
                data: [3, 2, 3, 4, 8, 5, 6, 7, 6],
                borderColor: [
                    'red'
                ],
                borderWidth: 3,
                tension: 0.1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
            }
        },
    });


})

function initialHeight() {
    $(".content").css(`height:${innerHeight}px;`)
}

function sideBarConfig() {
    let parent = $(".parent-side-bar");
    if (innerWidth <= 576) {
        parent.addClass('active-side-bar');
        $(".side-bar-txt-item").hide()
        $(".logo").hide()
    } else {
        parent.removeClass('active-side-bar');
        $(".side-bar-txt-item").show()
        $(".logo").show()
    }
}