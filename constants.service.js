(function(){
"use strict";

	angular.module('constants', [])
		.constant('constants', {
			// URL PARAMETERS	   

        CDR_CHART_MODULE: {
                meeting_started: "Meeting started at device local time",
                call_started: "Call started at device local time",
                missed_call: "Missed call occurred at device local time" ,
                jitter: "Jitter (ms",
                packet: "Pkt loss (%)",
                audio: "Audio level (db)",
                on: " on ",
                duration: "Duration: ",
                minutes: " Minutes ",
                minute: " Minute ",
                seconds: " Seconds ",
                second: " Second ",
                participants: " Participants",
                participant: " Participant",
                no_stats_available: "No Call Stats Available",
                no_stats_description: "To enable call statistics, set Audio Diagnostics in the profile or device specific configuration to statistics or diagnostic.",
                in_jitter: "In jitter",
                out_jitter: "Out jitter",
                in_packet_loss: "In packet loss",
                out_packet_loss: "Out packet loss",
                in_level: "In level",
                out_level: "Out level",
                diagnostic_report: "Feedback",
                to_and_from_the_phone: "To and from the phone",
                to_the_phone: "To the phone",
                from_the_phone: "From the phone"
            }  									
	});
}());
