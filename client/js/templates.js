define(function(){
	
	var templates = {};

        templates.entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
          };

          templates.escapeHtml = function(string) {
                return String(string).replace(/[&<>"'\/]/g, function (s) {
                  return templates.entityMap[s];
                });
          };



	templates.recordTpl = '<tr data-id="{{ record.id }}">'+
        '<td data-colname="name">{{ record.name }}</td>'+
        '<td data-colname="description"><pre>{{ record.description }}</pre></td>'+
        '<td data-colname="url">{{ record.url }}</td>'+
        '<td data-colname="username">{{ record.username }}</td>'+
        '<td data-colname="password" data-plain="{{ record.password }}">********</td>'+
        '<td><button class="edit">Edit</button><input type="submit" class="save" value="Save"></td>'+
        '<td><button class="delete">Delete</button><button class="cancel">Cancel</button></td>'+
	'</tr>';

	templates.render = function(template, locals){
		var tpl = template;
		for(var objName in locals){
			for(var attrName in locals[objName]){
				tpl = tpl.replace("{{ " + objName + "." + attrName  + " }}", templates.escapeHtml( locals[objName][attrName] ) );
			}
		}
		return tpl;
	};

	templates.renderRecord = function(record){
		return templates.render(templates.recordTpl,{ record: record });
	};

	return templates;
});
