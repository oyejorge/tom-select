


	// These tests are functional simulations of
	// user interaction, using syn.js. For more information:
	//
	// @see http://v3.javascriptmvc.com/docs.html#&who=syn
	// @see http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html

	describe('Interaction', function() {

		describe('dropdown', function() {

			it_n('should keep dropdown open after selection made if closeAfterSelect: false', function(done) {

				var test = setup_test('AB_Multi',{});

				click(test.instance.control, function() {
					click($('[data-value=a]', test.instance.dropdown_content), function() {
						expect(test.instance.isOpen).to.be.equal(true);
						expect(test.instance.isFocused).to.be.equal(true);
						done();
					});
				});
			});

			it_n('should close dropdown after selection made if closeAfterSelect: true', function(done) {

				var test = setup_test('AB_Multi',{closeAfterSelect: true});

				click(test.instance.control, function() {
					click( $('[data-value=a]', test.instance.dropdown_content), function() {
						expect(test.instance.isOpen).to.be.equal(false);
						expect(test.instance.isFocused).to.be.equal(true);
						done();
					});
				});
			});

			it_n('should reopen dropdown if clicked after being closed by closeAfterSelect: true', function(done) {

				var test = setup_test('AB_Multi',{closeAfterSelect: true});

				click(test.instance.control, function() {
					click($('[data-value=a]', test.instance.dropdown_content), function() {
						click(test.instance.control, function () {
								expect(test.instance.isOpen).to.be.equal(true);
								expect(test.instance.isFocused).to.be.equal(true);
								done();
						});
					});
				});
			});


			it_n('should close dropdown after selection made if closeAfterSelect: true and in single mode' , function(done) {

				var test = setup_test('AB_Single',{closeAfterSelect: true});

				click(test.instance.control, function() {
					expect(test.instance.isOpen).to.be.equal(true);
					click($('[data-value=a]', test.instance.dropdown_content), function() {
						expect(test.instance.isOpen).to.be.equal(false);
						done();
					});
				});
			});


			it_n('should blur dropdown after selection made if closeAfterSelect: true and in single mode' , function(done) {

				var test = setup_test('AB_Single',{closeAfterSelect: true});

				click(test.instance.control, function() {
					expect(test.instance.isFocused).to.be.equal(true);
					click($('[data-value=a]', test.instance.dropdown_content), function() {
						expect(test.instance.isFocused).to.be.equal(false);
						done();
					});
				});
			});

			it_n('should close dropdown after [escape] key press', function(done) {

				var test = setup_test('AB_Multi');

				click(test.instance.control, function() {
					expect(test.instance.isOpen).to.be.equal(true);

					syn.type('[escape]', test.instance.control_input, function() {
						expect(test.instance.isOpen).to.be.equal(false);
						done();
					});

				});
			});


			it_n('should change activeOption with [down] and [up] keypress', function(done) {

				var test = setup_test('AB_Multi');

				click(test.instance.control, function() {
					expect(test.instance.activeOption.dataset.value).to.be.equal('a');

					syn.type('[down]', test.instance.control_input, function() {
						expect(test.instance.activeOption.dataset.value).to.be.equal('b');

						syn.type('[up]', test.instance.control_input, function() {
							expect(test.instance.activeOption.dataset.value).to.be.equal('a');
							done();
						});

					});

				});
			});


		});


		describe('clicking control', function() {

			it_n('should give it focus', function(done) {

				var test = setup_test('AB_Single',{});

				click(test.instance.control, function() {
					expect(test.instance.isFocused).to.be.equal(true);
					done();
				});
			});


			it_n('should open dropdown menu', function(done) {
				var test = setup_test('AB_Single',{});

				click(test.instance.control, function() {
					expect(test.instance.isOpen).to.be.equal(true);
					expect($(test.instance.dropdown).is(':visible')).to.be.equal(true);
					done();
				});
			});

		});

		describe('clicking label', function() {

			it_n('should give it focus to select', function(done) {

				var inputId		= "labeledSelect";
				var label		= $('<label for="'+inputId+'">select</label>').appendTo('form');
				var test = setup_test('<select id="'+inputId+'">' +
					'<option value="a">A</option>' +
					'<option value="b">B</option>' +
				'</select>', {});


				syn.click(label)
					.delay(0, function() {
						label.remove();
						expect(test.instance.isFocused).to.be.equal(true);
						done();
					});
			});

			it_n('should give it focus to input', function(done) {

				var inputId		= "labeledInput";
				var label		= $('<label for="'+inputId+'">input</label>').appendTo('form');
				var test		= setup_test('<input id="'+inputId+'" type="text" value="a,b,c,d">', {});

				syn.click(label)
					.delay(0, function() {
						label.remove();
						expect(test.instance.isFocused).to.be.equal(true);
						done();
					});
			});

		});

		describe('clicking option', function() {

			it_n('should select it', function(done) {
				var test = setup_test('<select>' +
					'<option value="">Select an option...</option>' +
					'<option value="a">A</option>' +
					'<option value="b">B</option>' +
				'</select>', {});

				click(test.instance.control, function() {
					click($('[data-value="b"]', test.instance.dropdown), function() {
						expect(test.instance.input.value).to.be.equal('b');
						expect(test.instance.input.textContent).to.be.equal('B');
						done();
					});
				});
			});

			it_n('should close dropdown', function(done) {
				var test = setup_test('AB_Single', {});

				click(test.instance.control, function() {
					click($('[data-value="b"]', test.instance.dropdown), function() {
						expect(test.instance.isOpen).to.be.equal(false);
						expect($(test.instance.dropdown).is(':visible')).to.be.equal(false);
						done();
					});
				});
			});

		});

		describe('typing in input', function() {

			it_n('should filter results', function(done) {
				var test = setup_test('AB_Single', {});

				click(test.instance.control, function() {
					syn.type('a', test.instance.control_input)
					.delay(0, function() {
						expect($('[data-value="a"]', $(test.instance.dropdown)).length).to.be.equal(1);
						expect($('[data-value="b"]', $(test.instance.dropdown)).length).to.be.equal(0);
						done();
					});
				});
			});

			it_n('should hide dropdown if no results present and no_result template is null', function(done) {
				var test = setup_test('AB_Multi', {
					render:{'no_results':null}
				});

				click(test.instance.control, function() {
					syn.type('awaw', test.instance.control_input)
					.delay(0, function() {
						expect(test.instance.isOpen).to.be.equal(false);
						expect($(test.instance.dropdown).is(':visible')).to.be.equal(false);
						done();
					});
				});
			});


			it_n('should show no_results message if no results present', function(done) {
				var test = setup_test('AB_Multi');

				click(test.instance.control, function() {
					syn.type('awaw', test.instance.control_input)
					.delay(0, function() {
						expect(test.instance.isOpen).to.be.equal(true);
						expect(test.instance.dropdown.children.length).to.be.equal(1);
						expect(test.instance.dropdown.querySelectorAll('.no-results').length).to.be.equal(1);
						done();
					});
				});
			});


			it_n('should not hide dropdown if "create" option enabled and no results present', function(done) {
				var test = setup_test('AB_Multi', {create: true});

				click(test.instance.control, function() {
					syn.type('awaw', test.instance.control_input)
					.delay(0, function() {
						expect(test.instance.isOpen).to.be.equal(true);
						expect($(test.instance.dropdown).is(':visible')).to.be.equal(true);
						done();
					});
				});
			});

			it_n('should restore dropdown visibility when backing out of a query without results (backspace)', function(done) {
				var test = setup_test('AB_Multi', {});

				click(test.instance.control, function() {
					syn.type('awf', test.instance.control_input)
					.type('\b\b\b', test.instance.control_input, function() {
						expect(test.instance.isOpen).to.be.equal(true);
						expect($(test.instance.dropdown).is(':visible')).to.be.equal(true);
						done();
					});
				});
			});

			it_n('should move caret when [left] or [right] pressed', function(done) {
				var test = setup_test('<input type="text" value="a,b,c,d">', {create: true});

				click(test.instance.control, function() {
					syn.type('[left][left]whatt', test.instance.control_input, function() {
						expect(test.instance.caretPos).to.be.equal(2);
						done();
					});
				});
			});

			it_n('should not create input if comma entered in single select mode', function(done) {
				var test = setup_test('<select>' +
					'<option value="">Select an option...</option>' +
					'<option value="a">A</option>' +
					'<option value="b">B</option>' +
				'</select>', {create: true});

				click(test.instance.control, function() {
					syn.type('asdf,asdf', test.instance.control_input, function() {
						expect(test.instance.isOpen).to.be.equal(true);
						expect(test.instance.options).to.not.have.property('asdf');
						done();
					});
				});
			});

			it_n('should not delete any dropdown option text if duplicate match occurs', function(done) {
				var test = setup_test('<select>' +
					'<option></option>' +
					'<option value="a"></option>' +
					'<option value="b">Isabel Street</option>' +
				'</select>', {});

				click(test.instance.control, function() {
					// Here, the 'S' in St will also match the 's' in Isabel (a duplicate match)
					syn.type('Isabel St', test.instance.control_input, function() {
						expect($(test.instance.dropdown_content).find('.option[data-value=b]').text()).to.be.equal('Isabel Street');
						done();
					});
				});
			});

		});

		describe('selecting items',function(){

			it_n('should select previous item when [ctrl][left] pressed', function(done) {
				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				test.instance.setActiveItem(test.instance.getItem('b'));

				click(test.instance.control, function() {

					syn.type('[ctrl][left][ctrl-up]', test.instance.control_input, function() {
						expect( test.instance.activeItems.length ).to.be.equal(2);
						done();
					});
				});

			});

			it_n('should select next item when [ctrl][right] pressed, then unselect when [ctrl][left] pressed', function(done) {
				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				test.instance.setActiveItem(test.instance.getItem('a'));

				click(test.instance.control, function() {

					syn.type('[ctrl][right][ctrl-up]', test.instance.control_input, function() {
						expect( test.instance.activeItems.length ).to.be.equal(2);

						syn.type('[ctrl][left][ctrl-up]', test.instance.control_input, function() {
							expect( test.instance.activeItems.length ).to.be.equal(1);
							done();
						});

					});
				});

			});

			it_n('should not select next item when [ctrl][right] pressed at the end of item list', function(done) {
				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				test.instance.setActiveItem(test.instance.getItem('b'));

				click(test.instance.control, function() {

					syn.type('[ctrl][right][ctrl-up]', test.instance.control_input,function() {
						expect( test.instance.activeItems.length ).to.be.equal(1);
						done();
					});
				});

			});

			it_n('should move caret before selected item when [left] pressed', function(done) {
				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				test.instance.setActiveItem(test.instance.getItem('b'));

				let last_active			= test.instance.getLastActive();
				expect( last_active.nextElementSibling ).to.be.equal( test.instance.control_input );

				click(test.instance.control, function() {

					syn.type('[left]', test.instance.control_input, function() {
						let last_active			= test.instance.getLastActive();
						expect( last_active.previousElementSibling ).to.be.equal( test.instance.control_input );
						done();
					});
				});

			});


			it_n('clicking item should activate it', function() {
				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				var item = test.instance.getItem('a');
				expect(item.classList.contains('active')).to.be.equal(false);

				click(item,function(){
					expect(item.classList.contains('active')).to.be.equal(true);
				});
			});


			it_n('should select option with [enter] keypress', function(done) {

				var test = setup_test('AB_Multi');

				click(test.instance.control, function() {
					expect(test.instance.activeOption.dataset.value).to.be.equal('a');

					syn.type('[enter]', test.instance.control_input, function() {
						expect(test.instance.items.length).to.be.equal(1);
						expect(test.instance.items[0]).to.be.equal('a');
						done();

					});

				});

			});

			it_n('should select option with [tab] keypress when selectOnTab = true', function(done) {

				var test = setup_test('AB_Multi',{selectOnTab:true});

				click(test.instance.control, function() {
					expect(test.instance.activeOption.dataset.value).to.be.equal('a');

					syn.type('[tab]', test.instance.control_input, function() {
						expect(test.instance.items.length).to.be.equal(1);
						expect(test.instance.items[0]).to.be.equal('a');
						done();

					});

				});
			});

			it_n('should not select option with [tab] keypress when selectOnTab = false (default)', function(done) {

				var test = setup_test('AB_Multi',{});

				click(test.instance.control, function() {
					expect(test.instance.activeOption.dataset.value).to.be.equal('a');

					syn.type('[tab]', test.instance.control_input, function() {
						expect(test.instance.items.length).to.be.equal(0);
						done();

					});

				});
			});


			it_n('should select all items when [ctrl-a] pressed', function(done) {

				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');

				click(test.instance.control, function() {
					assert.equal( test.instance.activeItems.length, 0 );

					syn.type('[ctrl]a[ctrl-up]', test.instance.control_input, function() {
						assert.equal( test.instance.activeItems.length, 2 );
						done();

					});

				});
			});

			var ShiftMousedown = function(first_item,last_item){

				it_n('should select multiple items with [shift] + mousedown', function(done) {

					var test = setup_test('AB_Multi');

					test.instance.addItem('a');
					test.instance.addItem('b');
					test.instance.addItem('c');
					var itema = test.instance.getItem(first_item);
					var itemc = test.instance.getItem(last_item);

					assert.equal( test.instance.activeItems.length, 0 );

					// 1) hold shift down
					syn.type('[shift]', test.instance.control_input, function(){

						// 2) click first item
						click(itema,function(){
							assert.equal( test.instance.activeItems.length, 1 );

							// 3) click last item
							click(itemc,function(){
								assert.equal( test.instance.activeItems.length, 3 );

								// 4) release shift key
								syn.type('[shift-up]', test.instance.control_input, function(){});
								done();
							});
						});

					});

				});
			};

			ShiftMousedown('a','c');
			ShiftMousedown('c','a');


			it_n('should toggle active item when [ctrl] + mousedown', function(done) {

				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				var itema = test.instance.getItem('a');

				assert.equal( test.instance.activeItems.length, 0 );

				// 1) hold ctrl down
				syn.type('[ctrl]', test.instance.control_input, function() {

					// 2) activate itema
					click(itema,function(){
						assert.equal( test.instance.activeItems.length, 1 );

						// 3) de-activate itema with a click
						click(itema,function(){
							assert.equal( test.instance.activeItems.length, 0 );

							// 4) release ctrl key
							syn.type('[ctrl-up]', test.instance.control_input, function() {});
							done();

						});
					});

				});

			});

			var DeleteActiveItem = function(keypress){

				it_n('should remove active item when delete pressed', function(done) {

					var test = setup_test('AB_Multi');

					test.instance.addItem('a');
					test.instance.addItem('b');
					test.instance.setActiveItem(test.instance.getItem('b'));
					assert.equal( test.instance.items.length, 2 );

					syn.type(keypress, test.instance.control_input, function() {

						assert.equal( test.instance.items.length, 1 );
						assert.equal( test.instance.items[0], 'a' );
						done();

					});

				});
			};
			DeleteActiveItem('\b');
			DeleteActiveItem('[delete]');

			it_n('should remove item when backspace pressed', function(done) {

				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				assert.equal( test.instance.items.length, 2 );

				click(test.instance.control, function() {
					syn.type('\b', test.instance.control_input, function() {

						assert.equal( test.instance.items.length, 1 );
						assert.equal( test.instance.items[0], 'a' );
						done();
					});
				});

			});

			it_n('should remove first item when left then backspace pressed', function(done) {

				var test = setup_test('AB_Multi');

				test.instance.addItem('a');
				test.instance.addItem('b');
				assert.equal( test.instance.items.length, 2 );

				click(test.instance.control, function() {
					syn.type('[left]\b', test.instance.control_input, function() {

						assert.equal( test.instance.items.length, 1 );
						assert.equal( test.instance.items[0], 'b' );
						done();
					});
				});

			});


		});

		describe('blurring the input', function() {
			it_n('should close dropdown when createOnBlur is true', function(done) {

				var test = setup_test('AB_Multi',{
					createOnBlur: true,
					create: function(value){
						return {
							value: value,
							text: value
						};
					}
				});

				click(test.instance.control, function() {
					syn
						.type('fooo', test.instance.control_input)
						.delay(0, function() {
							expect(test.instance.isOpen).to.be.equal(true);
							expect($(test.instance.dropdown).is(':visible')).to.be.equal(true);

							syn
								.click($("body"))
								.delay(5, function() {
									expect(test.instance.isOpen).to.be.equal(false);
									expect($(test.instance.dropdown).is(':visible')).to.be.equal(false);
									done();
								});
						});
				});

			});
		});

		describe('creating items',function(){

			it_n('should create item when clicking on create option', function(done) {

				var test = setup_test('AB_Multi', {create: true});

				// 1) focus on control
				click(test.instance.control, function() {

					// 2) type "d"
					syn.type('d', test.instance.control_input, function() {

						// 2) hit enter to create
						syn.type('[enter]', test.instance.control_input, function() {
							expect(test.instance.items[0]).to.be.equal('d');
							done();
						});

					});

				});
			});

			it_n('create item should be focused when addPrecedence=true', function(done) {

				var test = setup_test('AB_Multi', {create: true,addPrecedence: true});

				click(test.instance.control, function() {
					syn.type('b', test.instance.control_input, function() {
						assert.equal( test.instance.activeOption.classList.contains('create'), true);
						done();
					});

				});
			});


			describe('filtering created items', function() {

				var text = 'abc';

				function execFilterTest(filter, done, expectation) {

					var test		= setup_test('<select multiple="multiple"></select>', {create: true, createFilter: filter});
					var instance	= test.instance;

					click(instance.control, function() {
						syn
							.type(text, instance.control_input)
							.type(instance.settings.delimiter, instance.control_input )
							.delay(0, function() {
								expectation(instance);
								done();
							})
					});
				}

				function execFilterTests(heading, filters, expectation) {
					for (var i = 0; i < filters.length; i++) {
						(function(filter) {
							it_n(heading, function(done) {
								execFilterTest(filter, done, expectation);
							});
						})(filters[i]);
					}
				}

				execFilterTests('should add an item  normally if there is no createFilter', [undefined, null, ''], function(instance) {
					expect(instance.getItem(text)).to.be.ok;
				});

				execFilterTests('should add an item if the input matches the createFilter', ['a', /a/, function() { return true; }], function(instance) {
					expect(instance.getItem(text)).to.be.ok;
				});

				execFilterTests('should not add an item or display the create label if the input does not match the createFilter (A)', ['foo', /foo/, function() { return false; }], function(instance) {
					expect(instance.getItem(text)).to.be.equal(undefined);
				});

				execFilterTests('should not add an item or display the create label if the input does not match the createFilter (B)', ['foo', /foo/, function() { return false; }], function(instance) {
					expect($(instance.dropdown_content).filter('.create').length).to.be.equal(0);
				});

			});


		});


		describe('locking', function() {

			it_n('typing should not show dropdown when locked', function(done) {

				var test = setup_test('AB_Multi',{});
				test.instance.lock();

				syn.type('a', test.instance.control_input, function() {
					expect(test.instance.isOpen).to.be.equal(false);
					done();
				});

			});
		});


		describe('openOnFocus', function() {

			it_n('only open after arrow down when openOnFocus=false', function(done) {

				var test = setup_test('AB_Single',{
					openOnFocus: false,
				});

				click(test.instance.control, function(){
					expect(test.instance.isOpen).to.be.equal(false);
					syn.type('[down]', test.instance.control_input, function() {
						expect(test.instance.isOpen).to.be.equal(true);
						done();
					});
				});
			});

			it_n('[enter] should not add item when dropdown isn\'t open', function(done) {

				var test = setup_test('AB_Multi',{
					openOnFocus: false,
				});

				click(test.instance.control, function(){
					expect(test.instance.isOpen).to.be.equal(false);
					syn.type('[enter]', test.instance.control_input, function() {
						expect(test.instance.items.length).to.be.equal(0);
						done();
					});
				});
			});

		});

	});
