import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-phone-input-2/lib/style.css'
import { useEffect } from 'react';
import DepenedencyInjectorImpl from './di/DependencyInjection';
import DependencyInjectionProvider from './di/provider/DependencyInjectionProvider';
import RoutesComponent from './ui/routes/RoutesComponent';

function App() {
  const di = DepenedencyInjectorImpl;
  
  // useEffect(() => {
  //   localStorage.clear();
  // }, []);
  
  return (
    <di.providers.user.Provider>
      <di.providers.languague.Provider>
        <di.providers.alert.Provider>
          <di.providers.modals.Provider>
            <DependencyInjectionProvider dependencyInjector={di}>
              <RoutesComponent />
            </DependencyInjectionProvider>
          </di.providers.modals.Provider>
        </di.providers.alert.Provider>
      </di.providers.languague.Provider>
    </di.providers.user.Provider>
  );
}

export default App;
