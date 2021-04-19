import router from './routes/index-r'
import './assets/common.css'

let hash = location.hash.slice(1);
router.go(hash);



