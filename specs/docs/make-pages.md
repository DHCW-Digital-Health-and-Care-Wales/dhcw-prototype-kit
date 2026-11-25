# Make pages

## Add a page

1. Create a file in `src/app/views`, for example `start.html`.
2. Add this and save:

   ```njk
   {% extends "layout.html" %}

   {% set pageName = "Start" %}

   {% block content %}
     <div class="nhsw-grid-row">
       <div class="nhsw-grid-column-two-thirds">
         <h1 class="nhsw-h1">Start</h1>
         <p class="nhsw-body">Your content.</p>
       </div>
     </div>
   {% endblock %}
   ```

3. Go to <http://localhost:3000/start>.

The address matches the file name. A file called `views/appointments/index.html`
is at `/appointments`.

## Use a component

Copy the HTML or Nunjucks example from the
[design system](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/index.html)
into your page.

You can call any component without importing it:

```njk
{{ nhswButton({ text: "Continue", type: "submit", classes: "nhsw-button--primary" }) }}
```

The design system site may describe a newer release than the one in your
prototype. The version you have is in `package.json`.

## Add a back link or breadcrumbs

```njk
{% block beforeContent %}
  {{ nhswBackLink({ href: "/start" }) }}
{% endblock %}
```

## Change the header, phase banner or footer

Add a `header`, `phaseBanner` or `footer` block to `src/app/views/layout.html`.
What you write replaces the kit's version on every page that uses the layout.

Keep the phase banner, or replace it with another clear sign that this is a
prototype.

## Add styles, scripts and images

- Styles go in `src/app/stylesheets/main.scss`.
- Scripts go in `src/app/scripts/main.js`.
- Images go in `src/app/assets/images`, and are used as `/assets/images/name.png`.

You can use design system tokens in your styles:

```scss
@use "dhcw-design-system/src/tokens/colours" as c;

.highlight {
  color: c.$nhswales-link-colour;
}
```
