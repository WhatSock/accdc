(function(){

	var answers =
					{
					q1:
									{
									q: 'Why do camels have three eyelids (two with lashes)?',
									a: 'To protect themselves from blowing sand.'
									},
					q2:
									{
									q: 'Who covered the 1932 Olympic games in Los Angeles as a reporter?',
									a: 'Gandhi'
									},
					q3:
									{
									q: 'Who sketched plans for a humanoid robot in the 15th Century?',
									a: 'Leonardo da Vinci'
									},
					q4:
									{
									q: 'In France, it\'s illegal for a pig to be named "Napolean".',
									a: 'True'
									},
					q5:
									{
									q: 'Coca-Cola was intended to be what when Atlanta pharmacist John Pemberton concocted it?',
									a: 'A cure for headaches'
									},
					q6:
									{
									q: 'A pig, allowed to live in Irish farmhouses in olden days, was once known as what?',
									a: '"the gentleman that pays the rent."'
									},
					q7:
									{
									q:
										'"Build a man a fire, and he\'ll be warm for a day. Set a man on fire, and he\'ll be warm for the rest of his life." Where is this quote from?',
									a: 'Jingo, by Terry Pratchett'
									},
					q8:
									{
									q: 'An egg tastes like chicken.',
									a: 'No idea... I was hoping you would know...'
									},
					q9:
									{
									q: 'Why?',
									a: 'I couldn\'t agree with you more ! '
									}
					};

	window.parseAnswers = function(t){
		var s = 'Summary:\n';

		for (a in answers){
			if (t[a])
				s += 'Question: ' + answers[a].q + '\nYour answer: ' + t[a] + '\nCorrect answer: ' + answers[a].a + '\n';
		}
		s += '\nCongratulations! For what, is yet to be determined, but congratulations anyway!';
		alert(s);
	};
})();