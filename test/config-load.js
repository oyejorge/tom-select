
describe('load', function() {

	it_n('should start loading results if preload:"focus"', function(done) {
		var calls_focus = 0;
		var calls_load = 0;

		var test = setup_test('AB_Single',{
			preload: 'focus',
			load: function(query, done) {
				calls_load++;
				assert.equal(query, '');
				setTimeout(function() {
					done([{value: 'c', text: 'C'}]);
				});
			}
		});

		test.instance.on('focus', function() {
			calls_focus++;
		});

		click(test.instance.control, function() {
			setTimeout(function() {
				assert.equal(calls_focus, 1);
				assert.equal(calls_load, 1);
				done();
			}, 300);
		});
	});


	it_n('should start loading if preload:true', function(done) {

		setup_test('AB_Single',{
			preload: true,
			load: function(query, load_cb) {
				assert.equal(query, '');
				load_cb([{value: 'c', text: 'C'}]);
				done();
			}
		});
	});

	it_n('load optgroups', function(done) {

		var test = setup_test('<input>',{
			optgroupField: 'class',
			labelField: 'name',
			searchField: ['name'],
			preload: true,
			load: function(query, loadcb) {

				var options = [
								{class: 'mammal', value: "dog" },
								{class: 'mammal', value: "cat" },
								{class: 'bird', value: 'duck'},
								{class: 'bird', value: 'chicken'},
								{class: 'reptile', value: 'snake'},
								{class: 'reptile', value: 'lizard'},
							];

				var groups = [{value: 'mammal', label: 'Mammal'},
								{value: 'bird', label: 'Bird'},
								{value: 'reptile', label: 'Reptile'}];
				loadcb(options,groups);

				assert.equal(Object.keys(test.instance.options).length, 6);
				assert.equal(Object.keys(test.instance.optgroups).length, 3);
				done();
			}
		});
	});



});
