# BeatFlix 🎵

A modern, feature-rich music streaming application built with React and Vite. BeatFlix offers a seamless music listening experience with a beautiful user interface and powerful features.

## ✨ Features

- 🎵 Browse trending songs and curated playlists
- 🔍 Real-time search with intelligent suggestions
- ❤️ Like and manage your favorite songs
- 📱 Responsive design for all devices
- 🎨 Modern and intuitive user interface
- ⚡ Fast and efficient performance
- 🎧 Smooth music playback experience

## 🛠️ Tech Stack

- **Frontend Framework:** React.js (Functional Components + Hooks)
- **Routing:** React Router v6
- **Styling:** Custom CSS with modern features
- **API Integration:** Axios
- **Build Tool:** Vite
- **API:** Saavn API integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/juhilhere/beatflix.git
cd beatflix
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory

```env
VITE_API_BASE_URL=https://saavn.dev/api
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
  ├── components/         # Reusable UI components
  │   ├── HomeCategories/ # Homepage category components
  │   ├── MusicPlayer/    # Audio player components
  │   ├── Search/         # Search functionality
  │   └── SongCard/       # Song display card
  ├── config/            # Configuration files
  ├── assets/           # Static assets
  └── App.jsx           # Main application component
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 💻 Best Practices

- **Component Structure:** Modular and reusable components
- **Styling:** Modern CSS features with responsive design
- **Error Handling:** Comprehensive error states and user feedback
- **Form Validation:** Input validation for search functionality
- **Performance:** Optimized assets and lazy loading
- **Security:** Environment variable usage for sensitive data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License 

## 🙏 Acknowledgments

- [Saavn API](https://saavn.dev) for providing the music data
- React.js community for excellent documentation and support
- All contributors who help improve this project

---

Made with ❤️ by Juhil
