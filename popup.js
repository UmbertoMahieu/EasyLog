document.addEventListener("DOMContentLoaded", function() {

  // Markup
  var activityContainer = document.getElementById("activity-container");
  var addActivityButton = document.getElementById("add-activity");
  var saveButton = document.getElementById("save");

  // Ajout d'une activité sur le forms & du bouton delete
  addActivityButton.addEventListener("click", function() {
    generateActivityField(null);
  });

  // fonction de création d'une activité
  function generateActivityField(activity = null) {

    var firstLanguage = "";
    var secondLanguage = "";
    var firstLanguageTemplate = "";
    var secondLanguageTemplate = "";

    if (activity){
      Object.keys(activity).forEach(key => {
        console.log(key, activity[key]);
        if(key == "English" || key == "French" || key == "Dutch" || key == "Italian"){
          if(firstLanguage == ""){
            firstLanguage = key;
            firstLanguageTemplate = activity[key];
          }
          else{
            secondLanguage = key;
            secondLanguageTemplate = activity[key];
          }
        } 
      })
    }

    var activityRow = document.createElement("div");
    activityRow.classList.add("activity-row");

    var activityNameLabel = document.createElement("label");
    activityNameLabel.setAttribute("for", "activity-name");
    activityNameLabel.textContent = "Activity Summary :";

    var activityNameInput = document.createElement("input");
    activityNameInput.setAttribute("type", "text");
    activityNameInput.setAttribute("name", "activity-name");
    activityNameInput.value = activity ? activity.name : ""; // Set the value from activity object if available

    activityContainer.appendChild(activityRow);

    var templateContainer1 = createTemplateContainer(1, firstLanguage, firstLanguageTemplate);
    var templateContainer2 = createTemplateContainer(2, secondLanguage, secondLanguageTemplate);

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
    activityRow.appendChild(document.createElement("br"));
    activityRow.appendChild(document.createElement("br"));
    activityRow.appendChild(document.createElement("br"));

  }

  // fonction de création d'une activité et ses emails templates
  function createTemplateContainer(index, language = null, template = null) {


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
      option.setAttribute("value", languageOptions[i]);
      option.textContent = languageOptions[i];
      if(language && languageOptions[i] == language){
        option.setAttribute("selected", "selected");
      }
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
    contentTextarea.value = template ? template : ""; // Set the value from activity object if available

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
   // Output the array of activities

    chrome.runtime.sendMessage({event : "clicked", activities});
  });

  chrome.storage.local.get(["data"], (result) => {
    var activities = [result.data]; // Wrap the activities object in an array
    console.log(activities[0]);

    Object.values(activities[0]).forEach(activity => {
      generateActivityField(activity);
      console.log(activity);
    })




  });
});
