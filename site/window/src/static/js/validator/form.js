function FormValidator(options) {
	this.form = options.form;
	this.fields = options.fields;
	this.errorMsgs = options.errorMsgs;
}

FormValidator.prototype = {
	validate: function () {
		var self = this;
		var isValid = true;

		Object.keys(this.fields).forEach(function (fieldName) {
			var fieldEl = document.querySelector(
				self.form + ' [name="' + fieldName + '"]'
			);
			var fieldValue = fieldEl.value.trim();

			if (self.fields[fieldName].regExp.test(fieldValue)) {
				fieldEl.classList.add("gear-valid-pass");
				isValid = true;
			} else {
				fieldEl.classList.add("gear-valid-failed");
				var errorMsg = self.errorMsgs[fieldName];
				fieldEl.insertAdjacentHTML(
					"afterend",
					'<div class="error-msg">' + errorMsg + "</div>"
				);
				isValid = false;
			}
		});

		return isValid;
	},

	disableSubmitBtn: function () {
		var submitBtn = document.querySelector(this.form + " input[type=submit]");
		submitBtn.disabled = true;
	},

	enableSubmitBtn: function () {
		var submitBtn = document.querySelector(this.form + " input[type=submit]");
		submitBtn.disabled = false;
	},

	resetErrorMsgs: function () {
		var errorMsgs = document.querySelectorAll(this.form + " .error-msg");
		errorMsgs.forEach(function (el) {
			el.remove();
		});

		var failedEls = document.querySelectorAll(
			this.form + " .gear-valid-failed"
		);
		failedEls.forEach(function (el) {
			el.classList.remove("gear-valid-failed");
		});

		var successEls = document.querySelectorAll(this.form + " .gear-valid-pass");
		successEls.forEach(function (el) {
			el.classList.remove("gear-valid-pass");
		});
	},
};
/**
<form id="my-form" action="" method="POST">
  <input type="text" name="username" placeholder="请输入用户名">
  <input type="password" name="password" placeholder="请输入密码">
  <input type="submit" value="提交">
</form>

document.addEventListener('DOMContentLoaded', function() {
  var formValidator = new FormValidator({
    form: '#my-form',
    fields: {
      username: {
        regExp: /^\w{6,18}$/
      },
      password: {
        regExp: /^\d{3,8}$/
      }
    },
    errorMsgs: {
      username: '请输入 6-18 位数字、字母或下划线的用户名',
      password: '密码须由 3-8 位数字组成'
    }
  });

  var submitBtn = document.querySelector('#my-form input[type=submit]');
  submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    formValidator.resetErrorMsgs();

    if (!formValidator.validate()) {
      return;
    }

    formValidator.disableSubmitBtn();

    // submitForm() 方法应该是另外某处定义的表单提交方法，这里不再赘述
    submitForm();

    setTimeout(function() {
      formValidator.enableSubmitBtn();
    }, 3000);
  });
});


// CSS 样式

.gear-valid-pass {
  border: 1px solid green;
  color: green;
}

.gear-valid-failed {
  border: 1px solid red;
  color: red;
}

.error-msg {
  margin-top: 4px;
  font-size: 12px;
  color: red;
}

 */
