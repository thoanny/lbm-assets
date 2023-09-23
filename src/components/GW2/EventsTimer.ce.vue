<script setup>
import { reactive, ref } from 'vue';

const data = reactive({
    hour: '00',
    minute: '00',
    localHour: '00',
    localMinute: '00',
    percentOfTwoHours: 0,
});

function movePointer() {
    // Get the time (server time = UTC time)
    var currentTime = moment.utc();
    var localTime = moment();

    // Format with leading 0s so 09:08 doesn't end up as 9:8
    var hour = ("00" + currentTime.hour()).slice(-2);
    var minute = ("00" + currentTime.minute()).slice(-2);

    var localHour = ("00" + localTime.hour()).slice(-2);
    var localMinute = ("00" + localTime.minute()).slice(-2);

    // How far along are we (in  % ) of the current 2 hour event cycles?
    var percentOfTwoHours = ((hour % 2) + (minute / 60)) * 50;

    data.hour = hour;
    data.minute = minute;
    data.localHour = localHour;
    data.localMinute = localMinute;

    // Set the text and move the pointer to that %
    // $('.pointer .server span').text(hour + ":" + minute);
    // $('.pointer .local span').text(localHour + ":" + localMinute);
    $('.pointer').css('left', percentOfTwoHours + "%");
}

// Function for updating the times
function updateTimes() {

    // For each block within a map
    $('.bar>div').each(function () {

        var offset = $(this).data('offset');

        var currentTime = moment.utc();

        // What hour was the start of this 2 hour block?
        var startHour = Math.floor(currentTime.hour() / 2) * 2;
        var correctedTime = "" + (startHour + (offset > 59 ? 1 : 0));

        // Format the time so 9:8 becomes 09:08
        var hour = ("00" + correctedTime).slice(-2);
        var minute = ("00" + (offset % 60)).slice(-2);

        // Set the text
        $(this).find('span').text(hour + ":" + minute);
    });
}

// Function for setting up the bars when first loaded
// based on the meta event info at the start
function setupBars() {

    // For each meta event..
    $.each(metas, function (key, metaEvent) {
        if (!metaEvent.phases) return;

        // Create a bar for it on the page
        var bar = $('<div class="bar"></div>');
        var offset = 0;

        // For each phase within a bar
        $.each(metaEvent.phases, function (i, metaPhase) {

            // Create a block to represent that phase, and set the color
            // and width based on the duration and color info
            var block = $('<div style="background-color: #F5F5F5;" data-offset="0"> <span></span> <strong></strong></div>');
            block.css('background', metaPhase.color);
            block.css('width', (100 * metaPhase.duration / 120) + "%");

            // Store the bar's offset for use in updating the time
            block.data('offset', offset);
            offset += metaPhase.duration;

            // Set the phase name for this block (e.g. Sandstorm)
            block.find('strong').text(metaPhase.name);

            // add this block to the bar
            bar.append(block);
        });

        // Set the name for the meta event and add the bar to the page
        $('.wrapper').append($('<h2>' + metaEvent.name + '</h2>'));
        $('.wrapper').append(bar);
    });
}

// Now lets do the things
// setupBars();

// Start the pointer/times at the right place
movePointer();
// updateTimes();

// set up a timer to update the pointer and times every 5 seconds
setInterval(movePointer, 5000);
// setInterval(updateTimes, 5000);
</script>

<template>
    <div class="wrapper">
        <div class="pointer">
            <span class="server"><strong>Server time</strong><span>{{ data.hour }}:{{ data.minute }}</span></span>
            <span class="local"><strong>Your time</strong><span>{{ data.localHour }}:{{ data.localMinute }}</span></span>
        </div>
    </div>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400, 700);

body {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: #333;
}

.wrapper {
    position: relative;
    padding-top: 2em;
}

.pointer {
    position: absolute;
    height: 4000%;
    border-left: 2px solid red;
    z-index: 400;
    top: 0;
    transition: left 1s ease-in-out;
}

.pointer .server {
    position: absolute;
    left: 0;
    background: red;
    color: white;
    font-size: 0.8em;
    font-weight: bold;
    padding: 4px 6px;
    margin-left: -2px;
}

.pointer .local {
    position: absolute;
    right: 2px;
    background: #B6B6B6;
    color: white;
    font-size: 0.8em;
    font-weight: bold;
    padding: 4px 6px;
    margin-left: 0px;
}

.pointer .server strong {
    position: absolute;
    top: 2.1em;
    color: #B9B9B9;
    left: 6px;
    width: 10em;
}

.pointer .local strong {
    position: absolute;
    top: 2.1em;
    color: #B9B9B9;
    right: 6px;
    width: 10em;
    text-align: right;
}

.bar {
    display: flex;
    flex-wrap: nowrap;
}

h2 {
    font-size: 1em;
    font-weight: bold;
    width: 100%;
    margin: 0.25em 0;
    color: #AAA;
}

.bar>div {
    box-sizing: border-box;
    padding: 0.5em;
    font-size: 0.8em;
    position: relative;
    font-weight: bold;
}

.bar>div>span {
    display: inline-block;
    padding: 0px 0 2px 0;
    margin: 2px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: normal;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.bar>div>strong {
    display: block;
}
</style>