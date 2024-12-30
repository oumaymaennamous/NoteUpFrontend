// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/admin/filiere', // La route que vous appelez depuis votre frontend
          destination: 'http://localhost:8080/admin/filiere', // L'URL de votre API backend
        },
        {
            source: '/admin/filiere/:id', // La route que vous appelez depuis votre frontend
            destination: 'http://localhost:8080/admin/filiere/:id', // L'URL de votre API backend
        },
        {
          source: '/admin/promos', // La route que vous appelez depuis votre frontend
          destination: 'http://localhost:8080/admin/promos', // L'URL de votre API backend
        },
      ];
    },
  };
  