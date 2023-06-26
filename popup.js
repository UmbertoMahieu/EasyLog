document.addEventListener("DOMContentLoaded", function() {

  // Markup
  var activityContainer = document.getElementById("activity-container");
  var addActivityButton = document.getElementById("add-activity");
  var saveButton = document.getElementById("save");

  // Ajout d'une activité sur le forms & du bouton delete
  addActivityButton.addEventListener("click", function() {
    var activityRow = document.createElement("div");
    activityRow.classList.add("activity-row");

    var activityNameLabel = document.createElement("label");
    activityNameLabel.setAttribute("for", "activity-name");
    activityNameLabel.textContent = "Activity Name :";

    var activityNameInput = document.createElement("input");
    activityNameInput.setAttribute("type", "text");
    activityNameInput.setAttribute("name", "activity-name");

    var templateContainer1 = createTemplateContainer(1);
    var templateContainer2 = createTemplateContainer(2);

    activityRow.appendChild(activityNameLabel);
    activityRow.appendChild(activityNameInput);
    activityRow.appendChild(document.createElement("br"));
    activityRow.appendChild(templateContainer1);
    activityRow.appendChild(document.createElement("br"));
    activityRow.appendChild(templateContainer2);

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove Activity";
    removeButton.type = "button";
    removeButton.addEventListener("click", function() {
      activityContainer.removeChild(activityRow);
    });

    activityRow.appendChild(removeButton);

    activityContainer.appendChild(activityRow);
  });

  // fonction de création d'une activité et ses emails templates
  function createTemplateContainer(index) {
    var templateContainer = document.createElement("div");
    templateContainer.classList.add("template-container");

    var languageLabel = document.createElement("label");
    languageLabel.setAttribute("for", "template-language-" + index);
    languageLabel.textContent = "Language :";

    var languageSelect = document.createElement("select");
    languageSelect.setAttribute("id", "template-language-" + index);
    languageSelect.setAttribute("name", "template-language-" + index);

    var languageOptions = ["French", "English", "Dutch", "Italian"];

    for (var i = 0; i < languageOptions.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", languageOptions[i].toLowerCase());
      option.textContent = languageOptions[i];
      languageSelect.appendChild(option);
    }

    var contentLabel = document.createElement("label");
    contentLabel.setAttribute("for", "template-content-" + index);
    contentLabel.textContent = "Mail Template : ";

    var contentTextarea = document.createElement("input");
    contentTextarea.setAttribute("id", "template-content-" + index);
    contentTextarea.setAttribute("name", "template-content-" + index);
    contentTextarea.setAttribute("rows", "4");
    contentTextarea.setAttribute("cols", "50");

    templateContainer.appendChild(languageLabel);
    templateContainer.appendChild(languageSelect);
    templateContainer.appendChild(document.createElement("br"));
    templateContainer.appendChild(contentLabel);
    templateContainer.appendChild(contentTextarea);

    return templateContainer;
  }

  // logique du bouton save et envoi vers le backgrounds
  saveButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    var activityRows = document.querySelectorAll(".activity-row");
    var activities = [];

    activityRows.forEach(function(row) {
      var activityNameInput = row.querySelector("input[name='activity-name']");
      var templateLanguageInputs = row.querySelectorAll("select[name^='template-language']");
      var templateContentInputs = row.querySelectorAll("input[name^='template-content']");

      var activity = {
        name: activityNameInput.value
      };

      templateLanguageInputs.forEach(function(select, index) {
        var language = select.value;
        var content = templateContentInputs[index].value;
        activity[language] = content;
      });

      activities.push(activity);
    });
    // console.log(activities); // Output the array of activities

    chrome.runtime.sendMessage({event : "clicked", activities});
  });

  chrome.storage.local.get(["data"], (result) => {
    console.log("Storage get :")
    console.log(result); 
  })
});
