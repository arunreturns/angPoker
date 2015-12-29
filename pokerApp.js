/* global angular */

var pokerApp = angular.module('pokerApp', ["ngAnimate"]);

pokerApp.controller('MainController', function($scope, $timeout){
   $scope.cardsList = [];
   $scope.dealCount = 0;
   $scope.winningHand = null;
   
   $scope.pokerHands = {
      "One Pair": "false",
      "Two Pair": "false",
      "Three of a kind": "false",
      "Straight": "false",
      "Flush": "false",
      "Full house": "false",
      "Four of a kind": "false",
      "Straight Flush": "false"
   };
   /* 
      cardSuit ==> Value from $scope.suits
      cardValue ==> A-K
      cardImage ==> 
      isHeld ==> true/false
   */
   $scope.suits = ["diamonds", "hearts", "clubs", "spades"];
   $scope.cards = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
   
   $scope.resetHand = function(){
      $scope.winningHand = null;
      
      $scope.cardsList = [];
      $scope.dealCount = 0;
      
      for (var key in $scope.pokerHands) {
         $scope.pokerHands[key] = false;
      }
   };
   
   $scope.generateHand = function(){
      $scope.winningHand = null;
      if ( !$scope.cardsList || $scope.cardsList.length === 0 ){
         $scope.dealCount++; // Initial Deal
         for ( var i = 0 ; i < 5; i ++ ){
            $scope.setCard(i);
         }
         console.log("Card List is ",$scope.cardsList);
      } else {
         $scope.dealCount++; // Second Deal
         console.log("Card List before " ,$scope.cardsList);
         for ( i = 0 ; i < 5; i ++ ){
            if ( $scope.cardsList[i].isHeld )
               continue;
            $scope.setCard(i);
         }
         console.log("Card List after " ,$scope.cardsList);
         
         $scope.checkForWinningHand();
      }
   };
   
   $scope.setCard = function(index){
      var retry = true;
      while ( retry ) {
         console.log("Generating card");
         var card = $scope.getRandomCard();
         if ( $scope.checkCardExistance(card))
            continue;
         else {
            $scope.cardsList[index] = card;
            break;
         }
      }
   };
   
   $scope.checkForWinningHand = function(){
      var pairMap = {}, suitMap = {};
      for ( var i = 0 ; i < 5; i ++ ){
         if (pairMap[$scope.cardsList[i].cardValue])
            pairMap[$scope.cardsList[i].cardValue] += 1;
         else 
            pairMap[$scope.cardsList[i].cardValue] = 1;
            
         if ( suitMap[$scope.cardsList[i].cardSuit] )
            suitMap[$scope.cardsList[i].cardSuit] += 1;
         else 
            suitMap[$scope.cardsList[i].cardSuit] = 1;
      }
      
      // Check for one pair
      for (var key in pairMap) {
         console.log(key, pairMap[key]);
         if ( pairMap[key] === 2) {
            console.log("One pair found for ", key);
            $scope.pokerHands["One Pair"] = true;
            break;
         }
      }
      
      // Check for two pair 
      var pairCount = 0;
      for (var key in pairMap) {
         console.log(key, pairMap[key]);
         if ( pairMap[key] === 2) {
            pairCount++;
         }
      }
      if ( pairCount == 2 )
         $scope.pokerHands["Two Pair"] = true;
         
      // Check for three of a kind
      for (var key in pairMap) {
         console.log(key, pairMap[key]);
         if ( pairMap[key] === 3) {
            console.log("Three of a kind found for ", key);
            $scope.pokerHands["Three of a kind"] = true;
            break;
         }
      }
      
      // Check for straight 
      var isStraight = true;
      if ( $scope.pokerHands["One Pair"] ) {
         isStraight = false;
      } else {
         var valueList = [];
         if ( Object.keys(pairMap).length < 5 ) {
            console.log("Not enough cards for straight");
            isStraight = false;
         } else {
            for ( var value in pairMap ){
               console.log("Looping for value", value);
               valueList.push($scope.cards.indexOf(value));
            }
            console.log("Value list is ", valueList);
            var cards = valueList.sort(function(a, b){return a-b});
            console.log("Sorted cards list is ", cards);
            for(i = 1; i < cards.length; i++) {
               if(cards[i] - cards[i-1] != 1) {
                  console.log("Not a straight set");
                  isStraight = false;
                  break;
               }
            }
         }
      }
      
      var noOfSuits = Object.keys(suitMap).length;
      var noOfCards = Object.keys(pairMap).length;
      console.log("Number of suits ", noOfSuits);
      console.log("Number of card val ", noOfCards);
      
      if ( noOfCards  === 2) {
         $scope.pokerHands["Full House"] = true;
      } 
      
      if (isStraight){
         $scope.pokerHands["Straight"] = true;
         if ( noOfSuits === 1 )
            $scope.pokerHands["Straight Flush"] = true;
      } else {
         if ( noOfSuits === 1 )
            $scope.pokerHands["Flush"] = true;
      }
      
      // Check for four of a kind
      for (var key in pairMap) {
         console.log(key, pairMap[key]);
         if ( pairMap[key] === 4) {
            console.log("Four of a kind found for ", key);
            $scope.pokerHands["Four of a kind"] = true;
            break;
         }
      }
      var winningHand;
      
      for (var key in $scope.pokerHands) {
         if ( $scope.pokerHands[key] === true){
            winningHand = key;
         }
      }
      
      $scope.winningHand = winningHand || "No win";
      console.log(winningHand);
      console.log(pairMap);
   };
   
   /* Loop through the card set to find if the card exists */
   $scope.checkCardExistance = function(card){
      for ( var i = 0 ; i < $scope.cardsList.length; i ++ ){
         if ( $scope.cardsList[i].cardSuit === card.cardSuit && $scope.cardsList[i].cardValue === card.cardValue)
            return true;
      }
      return false;
   };
   
   $scope.getRandomCard = function(){
      // Get the suits
      var suitVal = $scope.getRandomValue(1,4) - 1;
      // Get the card value
      var cardVal = $scope.getRandomValue(1,13) - 1;
      console.log("The card value is ", cardVal , " of ", suitVal);
      console.log("The card value is ", $scope.cards[cardVal] , " of ", $scope.suits[suitVal]);
      
      var card = {};
      card.cardValue = $scope.cards[cardVal];
      card.cardSuit = $scope.suits[suitVal];
      card.cardImage = "card-images/" + card.cardValue + "_of_" + card.cardSuit + ".png";
      card.isHeld = false;
      
      return card;
   };
   
   $scope.getRandomValue = function(min, max){
      return Math.floor(Math.random() * max) + min; 
   };
});
