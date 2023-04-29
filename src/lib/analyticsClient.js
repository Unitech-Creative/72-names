// Client Side Only

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export const AppAnalytics = () => {
  return (
    <>
      <Analytics />
      {/* <SegmentAnalyticsScript /> */}
      <HeapAnalyticsScript />
    </>
  );
};

function HeapAnalyticsScript() {
  return (
    <Script id="heap-analytics-script" strategy="lazyOnload">
      {`  window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load("${process.env.NEXT_PUBLIC_HEAP_ANALYTICS_APP_ID}");`}
    </Script>
  );
}

function SegmentAnalyticsScript() {
  return (
    <Script id="segment-analytics-script" strategy="lazyOnload">
      {`
          !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="5IZf7jT51L2M749vu7iiFCgQcMNx7iEW";;analytics.SNIPPET_VERSION="4.15.3";
          analytics.load("${process.env.NEXT_PUBLIC_SEGMENT_APP_ID}");
          analytics.page();
          }}();
        `}
    </Script>
  );
}

export const identify = (user) => {
  const checkAndIdentify = () => {
    if (
      typeof window.heap !== "undefined" &&
      typeof window.analytics !== "undefined"
    ) {
      window.heap.identify(user.id);

      window.analytics.identify(user.id, {
        name: user.name,
        email: user.email,
      });
    } else {
      setTimeout(checkAndIdentify, 500);
    }
  };

  checkAndIdentify();
};

export const track = (event, properties) => {
  window.analytics.track(event, properties);
};

export const trackingEvents = {
  account: {
    // registrationStarted: 'registrationStarted',
    // registrationCompleted: 'registrationCompleted',
    // accountActivation: 'accountActivation',
    created: "accountCreated",
  },
  authentication: {
    login: "login",
    loginFailure: "loginFailure",
    logout: "logout",
  },
  courseInteraction: {
    courseSearch: "courseSearch",
    courseView: "courseView",
    courseEnrollment: "courseEnrollment",
    courseCompletion: "courseCompletion",
    courseRatingReview: "courseRatingReview",
    courseUnenrollment: "courseUnenrollment",
  },
  lessonInteraction: {
    lessonView: "lessonView",
    lessonStarted: "lessonStarted",
    lessonCompleted: "lessonCompleted",
  },
  comments: {
    created: "commentCreated",
    replyCreated: "commentReplyCreated",
    // commentLiked: 'commentLiked',
    // commentReported: 'commentReported',
  },
  test: {
    development: "developmentTest",
    altDevelopment: "altDevelopmentTest",
  },
};
