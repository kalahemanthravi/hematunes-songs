document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('songs-grid');
    const yearSpan = document.getElementById('year');

    // Set current year
    yearSpan.textContent = new Date().getFullYear();

    // Fetch songs data from local json file
    fetch('songs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            renderSongs(data.songs);
        })
        .catch(error => {
            console.error('Error loading songs:', error);
            grid.innerHTML = `
                <div class="loader" style="color: #ef4444; animation: none;">
                    <strong>Failed to load songs.</strong><br><br>
                    Please ensure the <code>songs.json</code> file exists and is valid.<br>
                </div>`;
        });

    function renderSongs(songs) {
        grid.innerHTML = '';

        if (!songs || songs.length === 0) {
            grid.innerHTML = `<div class="loader">No songs found yet. Add some tuned tracks to your songs.json!</div>`;
            return;
        }

        songs.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'song-card';

            // We use the audio controls to directly let the user play the track from the card.
            // When multiple play, the user could pause others manually, or we could add script logic to pause others.
            card.innerHTML = `
                <div class="card-header">
                    <h4 class="song-title">${song.title || 'Untitled'}</h4>
                    <span class="badge">${song.genre || 'Tuned'}</span>
                </div>
                <div class="card-body">
                    <p class="song-description">${song.description || 'Enjoy this beautiful tune by hemanthravi.'}</p>
                    <div class="audio-container">
                        <audio controls class="audio-player">
                            <source src="${song.audioFile || ''}" type="audio/mpeg">
                            Your browser does not support the html5 audio element.
                        </audio>
                    </div>
                </div>
            `;

            grid.appendChild(card);

            // Apply delay to animation using Web Animations API for a cascading entrance effect
            card.animate([
                { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
            ], {
                duration: 600,
                delay: index * 100, // staggered delay
                fill: 'forwards',
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            card.style.opacity = 0; // Set initial state
        });

        // Add functionality to pause other audio players when one starts playing
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.addEventListener('play', () => {
                audios.forEach(otherAudio => {
                    if (otherAudio !== audio) {
                        otherAudio.pause();
                    }
                });
            });
        });
    }
});
