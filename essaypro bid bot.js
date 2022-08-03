// ==UserScript==
// @name         EssayPro Bidding Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.essaypro.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=essaypro.com
// @grant        none
// ==/UserScript==

(function() {
    const unwantedJobs = ["Thesis/Dissertation", "Excel Assignment", "Programming", "Math Assignment", "Physics Assignment"];
    if (window.location.href.includes("https://app.essaypro.com/#/writer/orders-available/all")) {
       setTimeout(SortAvailableOrders, 14000);
       setTimeout(function(){window.open("https://app.essaypro.com/#/writer/orders-available/all");}, 60000);
    } else {
        setTimeout(placeBid, 14000);
    }
    setTimeout(function(){window.close();}, 61000);
    function SortAvailableOrders(){//this function will sort out the available orders
       const All_Orders_Available = AllAvailabe();
        console.log(All_Orders_Available);
       const UnurgentJobs = cleanOrders(All_Orders_Available);
        console.log(UnurgentJobs);
        const DesiredJob = filter_unwanted_orders(UnurgentJobs);
        console.log(DesiredJob);
        OpenBiddingPage(DesiredJob);
    }
    function OpenBiddingPage(DesiredJob){
        const NumberofJobs = DesiredJob.length;
        const intervals = [5000];
        var counter = 0;
        while(counter<NumberofJobs){
            intervals[intervals.length] = intervals[intervals.length-1] + 5000;
            counter ++;
        }
        counter = 0;
       var interval = 0
        while (counter < NumberofJobs){
            var job = DesiredJob[counter].href;
            if(checkSession(job)==0){
              window.open(job);
               addSessionItem(job);
                interval ++;
            }
            if(interval >= 4)break;
            counter ++;
        }
    }
    function filter_unwanted_orders(UnurgentJobs){
        const DesiredOrders = [];
        var counter = 0;
        var NumberofUnwantedOrders = UnurgentJobs.length;
        try {
          while(counter<NumberofUnwantedOrders){
              if(unwantedJobs.includes(UnurgentJobs[counter].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[5].innerText)==""){//if the job is desirable
                  DesiredOrders[DesiredOrders.length] = UnurgentJobs[counter];
              }
              counter ++;
          }
        }
        catch(err) {
             console.log(err.message);
        }
            finally {
               return DesiredOrders;
            }
    }
    function cleanOrders(All_Orders_Available){
        const cleanorders = [];
        var counter = 0;
        var NumberofOrders = All_Orders_Available.length;
            try {
                while(counter<NumberofOrders){//remove urgent orders
                    if(All_Orders_Available[counter].children[0].children[0].children[2].children[1].children[0].innerHTML.search("hours")==-1){//If there is an urgent order, remove.
                        cleanorders[cleanorders.length] = All_Orders_Available[counter];
                    }
                    counter ++;
                }
                cleanorders = All_Orders_Available;
            }
            catch(err) {
                console.log(err.message);
            }
                finally {
                   return cleanorders;
                }
        }
    function AllAvailabe(){
     const AllAvailableOrdersObj = document.getElementsByClassName("ng-star-inserted");
        //sort through all the elements with the class name and give only the link tag
        var counter = 0;
        const AllLinkTags = [];//These are all the link tags that are actually links to a job
        const AllAvailableOrdersObj_size = AllAvailableOrdersObj.length;
        while(counter<AllAvailableOrdersObj_size){
            var temp_variable = "https://app.essaypro.com/#/writer";
           if(AllAvailableOrdersObj[counter].localName=="a"&&AllAvailableOrdersObj[counter].innerText!="INVITED"&&AllAvailableOrdersObj[counter].innerText!="ALL"&&AllAvailableOrdersObj[counter].innerText!="HIDDEN"&&AllAvailableOrdersObj[counter].innerText!="HIDDEN"&&AllAvailableOrdersObj[counter].href!=temp_variable){
               const sizeOfAllLinkTags = AllLinkTags.length;
           AllLinkTags[sizeOfAllLinkTags] = AllAvailableOrdersObj[counter];
           }
            counter ++;
        }
        return AllLinkTags;
    }
   function placeBid(){//the work of this function is to place a bid when we are on the bidding page
    /*
    Delay before execution for page to load
    check parameters ie equal to writershub
    if parameters match, take bid
    */
       const PlaceMyBidObj = document.getElementsByClassName("button-filled__primary h-40 ng-star-inserted");
      PlaceMyBidObj[0].click();
     setTimeout(CalclulateBid, 2500);

   }
    function CalclulateBid(){
    const CostPerPageObj = document.getElementsByClassName("t-value");
     var costPerPage =CostPerPageObj[2].innerText;
        costPerPage = Number(costPerPage .replace(/[^0-9\.]+/g,""));
        if (costPerPage>=4.5){//if cost per page is more than the stipulated amount in dollars, BID
            setTimeout(SubmitBid, 2500);
        }else{
       window.close();
    }
         }
    function SubmitBid() {//This function will submit the bid
    const SubmitMyBidObj = document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-lg");
        SubmitMyBidObj[0].click();
       if(document.getElementsByClassName("button-default goog-inline-block").length==0){//Check whether security reCAPTCHA is active
                      setTimeout(ClickChatBtn, 13000);
        }else{
            sessionRemoveItem(window.location.href);
            window.close();
        }
    }
    function ClickChatBtn(){
     const StartChatObj = document.getElementsByClassName("ant-btn ant-btn-primary");
     StartChatObj[0].click();
     setTimeout(PlaceChat,2000);
    }
    function PlaceChat(){
     const ChatBoxObj = document.getElementsByClassName("chat-footer-message-textarea");
        ChatBoxObj[0].innerHTML = "You deserve a high-quality paper that is free from plagiarism. I can provide that. Talk to me and we will discuss the instructions!";
        setTimeout(function(){const SendMessage = document.getElementsByClassName("chat-footer-message-btn _active"); SendMessage[0].click();document.getElementsByClassName("chat-header-icon")[0].click();window.close();},2000);
    }
    function checkSession(query){
    var response = 0;
        var counter = 0;
        const sessionSize = sessionStorage.length;
        while(counter < sessionSize){
        if(sessionStorage[counter] == query){
        response = 1;
            break;
        }
            counter ++;
        }
        return response;
    }
    function addSessionItem(item){
            var key = sessionStorage.length;
            sessionStorage.setItem(key, item);
    }
function sessionRemoveItem(item){
    var key = sessionStorage.indexOf(item);
    sessionStorage.splice(key,1);
}
    // Your code here...
})();
