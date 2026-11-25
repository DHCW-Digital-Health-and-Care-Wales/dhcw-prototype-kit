let loadedVersion

new EventSource('/prototype-admin/live-reload').addEventListener('message', (event) => {
  if (loadedVersion && loadedVersion !== event.data) {
    window.location.reload()
  }

  loadedVersion = event.data
})
