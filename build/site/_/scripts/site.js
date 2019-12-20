(() => {
  'use strict';

  const toggles = document.querySelectorAll('.js-version');
  for (let i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('click', (e) => e.stopPropagation());
    toggles[i].addEventListener('change', (e) => window.location.href = e.target.value);
  };
})();

(function() {
  'use strict';

  var sidebar = document.querySelector(
    'main .article-wrapper > aside.toc-sidebar'
  );

  if (!sidebar) return;
  var doc;
  var headings;
  if (
    document.querySelector('.body.ui-toc') ||
    !(headings = find(
      'h1[id].sect0, .sect1 > h2[id]',
      (doc = document.querySelector('article.doc'))
    )).length
  ) {
    sidebar.parentNode.removeChild(sidebar);
    return;
  }
  var lastActiveFragment;
  var links = {};
  var menu;

  var list = headings.reduce(function(accum, heading) {
    var shds = toArray(find('h3', heading.parentNode));
    var $shdsList = document.createElement('ul');
    $shdsList.classList.add('subheading-list');

    function createLink(heading) {
      const link = toArray(heading.childNodes).reduce(function(target, child) {
        if (child.nodeName !== 'A') target.appendChild(child.cloneNode(true));
        return target;
      }, document.createElement('a'));

      links[(link.href = '#' + heading.id)] = link;
      return link;
    }

    shds.map((n) => {
      var $shdItem = document.createElement('li');
      $shdItem.classList.add('subheading-item');
      var $shdLink = createLink(n);
      $shdItem.appendChild($shdLink);
      $shdsList.appendChild($shdItem);
    });

    var link = createLink(heading);

    var listItem = document.createElement('li');
    listItem.appendChild(link);

    if (shds.length) {
      listItem.appendChild($shdsList);
    }

    accum.appendChild(listItem);
    return accum;
  }, document.createElement('ul'));

  if (!(menu = sidebar && sidebar.querySelector('.toc-menu'))) {
    menu = document.createElement('div');
    menu.className = 'toc-menu';
  }

  var title = document.createElement('h3');
  title.classList.add('toc-title');
  // title.textContent = 'On This Page';
  var elTitle = document.querySelector('main .article-wrapper h1');
  title.textContent = elTitle.textContent;
  menu.appendChild(title);
  menu.appendChild(list);

  if (sidebar) {
    window.addEventListener('load', function() {
      onScroll();
      window.addEventListener('scroll', onScroll);
    });
  }

  var startOfContent = doc.querySelector('h1.page ~ :not(.labels)');
  if (startOfContent) {
    var embeddedToc = document.createElement('aside');
    embeddedToc.className = 'toc embedded';
    embeddedToc.appendChild(menu.cloneNode(true));
    doc.insertBefore(embeddedToc, startOfContent);
  }

  function onScroll() {
    // NOTE doc.parentNode.offsetTop ~= doc.parentNode.getBoundingClientRect().top + window.pageYOffset
    //var targetPosition = doc.parentNode.offsetTop
    // NOTE no need to compensate wheen using spacer above [id] elements

    var headings = find(
      'h1[id].sect0, .sect1 > h2[id], .sect2 > h3[id]',
      (doc = document.querySelector('article.doc'))
    );

    var targetPosition = 0;
    var activeFragment;
    headings.some(function(heading) {
      if (Math.floor(heading.getBoundingClientRect().top) <= targetPosition) {
        activeFragment = '#' + heading.id;
      } else {
        return true;
      }
    });
    if (activeFragment) {
      if (activeFragment !== lastActiveFragment) {
        if (lastActiveFragment) {
          links[lastActiveFragment].classList.remove('toc-active');
        }
        var activeLink = links[activeFragment];
        activeLink.classList.add('toc-active');
        if (menu.scrollHeight > menu.offsetHeight) {
          menu.scrollTop = Math.max(
            0,
            activeLink.offsetTop + activeLink.offsetHeight - menu.offsetHeight
          );
        }
        lastActiveFragment = activeFragment;
      }
    } else if (lastActiveFragment) {
      links[lastActiveFragment].classList.remove('toc-active');
      lastActiveFragment = undefined;
    }
  }

  function find(selector, from) {
    return toArray((from || document).querySelectorAll(selector));
  }

  function toArray(collection) {
    return [].slice.call(collection);
  }
})();

(function () {
  'use strict'

  var sidrToggle = document.querySelector('.sidr-toggle'),
    sidrPanel = document.querySelector('#sidr'),
    mainContent = document.querySelector('.main'),
    closeMenuButton = document.querySelector('.close-menu-btn')

  var sidrCollapse = document.querySelectorAll('.collapsible')

  sidrToggle.addEventListener('click', function (e) {
    openNav()
    sidrPanel.classList.toggle('active')
  })

  closeMenuButton.addEventListener('click', function (e) {
    closeNav()
    sidrPanel.classList.toggle('active')
  })

  function openNav() {
    sidrPanel.style.minWidth = '100vw';
    mainContent.style.display = 'none';
  }

  function closeNav() {
    sidrPanel.style.minWidth = '0';
    mainContent.style.display = 'block';
  }

  sidrCollapse.forEach(function (o) {
    o.addEventListener('click', function (e) {
      this.classList.toggle('active')
      var dropdownContent = this.nextElementSibling
      if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
      } else {
        dropdownContent.style.display = 'none';
      }
    })
  })
})()
