import router from './routes/index-r'
import './assets/common.css'

// router.go('/');
router.go(location.hash.substr(1))


