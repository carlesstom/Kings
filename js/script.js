/* Author:

*/
$(document).ready(function(){
	setup();
})

//stretchtext alert#######################################################################

zIndex = 1;
clickedCards = new Array();
//lastCard = '';
kingsClicked = 0;
left = 40;
currentRule = 0;
playCustom = false;
allCards = new Array();
music = true;
values = ['a','2','3','4','5','6','7','8','9','10','j','q','k'];
defaultRules = ['In Ya face','2 For you','3 for me','chicks','make a rule','dudes','bottles','nominate','busta rhyme','categories','goes back','question man','king cup!']
defaultDescription = ['have a big drink','whoever chose this card nominates 2 drinks','3 drinks for whoever picked this card','ladies drink',"make a rule for the rest of the game e.g. talk like a pirate",'guys drink','bottles: 1,2,3,4,5,6,bottles,8,9,10,11,12,13,bottles etc...','nominate','bust a rhyme',"categories. e.g. 'types of beer'",'person before you drinks','if you get this card, anyone that answers your question must drink','pour beer into the king cup',]
customRules = new Array();
rules = new Array();

function restartGame(){
	kingsClicked = 0
	clickedCards = [];
	lastCard = '';
	zIndex = 1;
	$('#cardPile,#ruleDescription,#cardHistory ul').html('');
	$("#kingCount span").html(4-kingsClicked);
	$('#setup').show();
	$('#main, #rules').hide();
	setup();
}

function setup(){
	//preloadImages()
	cards();
	inputEnterHandler();
	//setScreenHeight();
	//loadGameplay()
	//setCustomRules()
}

function setScreenHeight(){
	hgt = $('body').height() - $('.menubar').each().height()
	$("#main").height( hgt )	
}
function loadGameplay(){
	$('#setup').hide();
	$('#main').show();
	messCards();
	if(rules.length<1)
	{
		setRules();
	}
	preventAccidentalExit() //off for debug
}

function preventAccidentalExit(){
	window.onbeforeunload = confirmExit;
}
function confirmExit(){
	return confirm('Do you want to leave? (You will lose your game and rules)');
}

function cards(){
	suits = ['h','d','s','c'];
	i = 0;
	card = "<div class='card down'></div>";
	for(x in suits){
		for(y in values){
			allCards.push(values[y] + suits[x]);
			$("#cardPile").append(card);
			i++;
		}
	}
}

function changeRuleset(){
	$("#main, #setup").hide();
	$("#rules").show();
}

function checkForRules(){
	return playCustom;
}

function playCustomRules(){
	if(customRules.length>0)
	{
		playCustom = true;
		setRules(playCustom);
		closeRulesPage();
	}
	else
	{
		alert("You need to setup rules first!");
	}
}

function setRules(custom){
	if (custom){
		if(checkForRules()){
			playCustom = true;
			rules = customRules;
			currentRule = 0;
		}else
		{
			alert("You must setup custom rules first!");
		}
	}else{
		playCustom = false;
		rules = defaultRules;
		currentRule = 0;
	}

}

function randomCard(){
	rnd = Math.floor((Math.random()*52)+1);
	while(cardUsed(rnd)){
		rnd = Math.floor((Math.random()*52)+1);
	}
	clickedCards.push(allCards[rnd]);
	return rnd;
}

function cardUsed(card){
	for(x in clickedCards){
		$("#usedCards").append(clickedCards[x] + ", ")
		if(clickedCards[x] === allCards[card]){
			return true;
		}
	}
	return false;
}

function randomRotation(){
	rnd = ( Math.floor((Math.random()*17)+1) ) * 10;
	return 'rot'+rnd;
}

function randomPositon(){
	rnd = ( $('#cardPile').width() / 2);
	if (( Math.floor((Math.random()*10)))>=5)
		rnd += ($('#cardPile').width() / 4) *Math.random();
	else
		rnd -= ($('#cardPile').width() / 4) *Math.random();
	return [rnd,randomTop()];
}

function randomTop(){
	rnd = ( $('#cardPile').height() / 2) + $(".menubar").height();
	if (( Math.floor((Math.random()*10)))>=5)
		rnd += ($('#cardPile').height() / 3) *Math.random();
	else
		rnd -= ($('#cardPile').height() / 3) *Math.random();
	return rnd;
}

function messCards(){
	$('#cardPile').children().each( function(){
			pos = randomPositon()
			$(this).addClass(randomRotation()).css('left', pos[0]+'px').css('top', pos[1]+'px')
		}
	);
	onCardClick();
}

function onCardClick(){
	$('.card').click(function(){
		if($(this).hasClass('down')){
			card = randomCard();
			that = this;
			setCardFace(that,card);
			$(this).removeClass('down').addClass('up').css('zIndex',zIndex);
			isKing(card);
			getRule(card);
			that = this;
			setTimeout(function(){
				enhance(that)	
				setTimeout(function(){
					moveToTop(that)
					addCardHistory(card)
				},1800)
			},100)
			zIndex++;
		}
	})
}

function isKing(card){
	if(allCards[card].indexOf("k") != -1){
		kingsClicked++;
		$("#kingCount span").html(4-kingsClicked);	
	}
}

function enhance(card){
	$(card).css('left','300px').css('top','300px').addClass('rot0').css('zIndex','1001');
}
 
function moveToTop(card){
	$(card).css('left',left + Math.random()*5+'px').css('top', 50).addClass('rot0').css('zIndex',zIndex);
}

function addCardHistory(card){
	icon = miniIcon(card);
	card = allCards[card].substring(0, allCards[card].length-1)
	$("#cardHistory ul").prepend("<li style='background-image:url("+icon+")'>" + card + "</li>")	
}

function miniIcon(card){
	suit = allCards[card].substring(allCards[card].length-1, allCards[card].length)
	if(suit == 'd'){
		icon = "img/diamondsmall.png";
	}
	else if(suit == 'c'){
		icon = "img/clubsmall.png";
	}
	else if(suit == 'h'){
		icon = "img/heartsmall.png";
	}
	else if(suit == 's'){
		icon = "img/spadesmall.png";
	}
	return icon;
}

function setCardFace(card,name){
	cardHeight = 147;
	cardWidth = 101;
	suit = allCards[name].substring(allCards[name].length-1, allCards[name].length);
	num = getCardPosition(name);
	if(suit == 'd'){
		topOffset = cardHeight*1;
	}
	else if(suit == 'c'){
		topOffset = 0;
	}
	else if(suit == 'h'){
		topOffset = cardHeight*2;
	}
	else if(suit == 's'){
		topOffset = cardHeight*3;
	}
	leftOffset = num * cardWidth;
	$(card).css('background-position','-'+leftOffset+'px -'+topOffset+'px');
}

function getRule(card){
	if(kingsClicked > 3){
		alertUser('Last king, drink up!!!');
		changeRuleDescription("GAME OVER");
		setTimeout(function(){
			restartGame();
		},3000);
	} else {
		card = getCardPosition(card);
		alertUser(rules[card]);
		changeRuleDescription(defaultDescription[card]);
	}
}

function changeRuleDescription(text){
	$('#ruleDescription').html(text)
	//setTimeout(function(){
		$("footer span").addClass("newDescription")	
		setTimeout(function(){
			$("footer span").removeClass("newDescription")	
		},3000)
	//},2500)
}

function setCustomRules(){	
	if (currentRule < 13){
		$("#inputRules, #blockUI").show();
		$("#ruleCardName span").html(values[currentRule]);
		$("#ruleValue").val(defaultRules[currentRule]);
	}else{
		setRules();
		$("#inputRules,#blockUI").hide();
	}
}

function submitCustomRule(){
	rule = $("#ruleValue").val();
	if(rule != '')
    {
		customRules.push(rule);
    }
	else
    {
		customRules.push(defaultRules[currentRule]);
    }
	currentRule++;
	setCustomRules();
	//$("#ruleValue").val('');
}

function playStandardRules(){
	setRules();
	closeRulesPage();
}

function closeRulesPage(){
	$("#rules").hide();
	$("#setup").show();
	if(checkForRules())
		$("#ruleName").html("Custom");
	else
		$("#ruleName").html("Standard");
}

function resetRules(){
	customRules = [];
	currentRule = 0;
	//setRules();
	//restartGame();
}

function changeMusic(){
	if(music == false){
		music = true;
		text = "off";
		aText = "Turn On";
		margin = '0px';
		displayGrooveshark();
	}else{
		music = false;
		text = "on";
		aText = "Turn Off";
		margin = '250px';
		hideGrooveshark();
	}
	
	$("#kingCount, #cardHistory").css('margin-right',margin)
	$("#musicSettingsBox span").html(text);
	$("#musicSettingsBox a").html(aText);
	$('.musicOnOff').html(text)
}
function displayGrooveshark(){
	$('#grooveshark').hide()
}
function hideGrooveshark(){
	$('#grooveshark').show()
}

function getCardPosition(card){
card = allCards[card].substring(0, allCards[card].length-1)
	if(card == 'j')
		card = 11;
	else if(card == 'q')
		card = 12;	
	else if(card == 'k')
		card = 13;
	else if(card == 'a')
		card = 1;
	card -= 1;
	return card;

}

function alertUser(text){
	$("#alert").empty().append(text);
	$("#blockUI, #alert").show();
	setTimeout(function(){
		hideAlert();
	}, 2000);
}
function hideAlert(){
	$('#alert, #blockUI').hide();
}

function closeCustomRules(){
	if(currentRule != 0)
		resetRules()
	$("#inputRules, #blockUI").hide();
}

function inputEnterHandler(){
	areas = $("#ruleValue")//add items to this and the if down bottom
	$(areas).keypress(function(event) {
		if ( event.which == 13 ) {
			event.preventDefault();
			action = $(this).attr('action');
		}else{
			action = '';
		}
		if(action == "submitCustomRule")
			submitCustomRule();
	})
}

function login(){
	alert("Sorry, Havnt done this bit yet");
}