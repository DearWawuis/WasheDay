import { Component, OnInit, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TipDescriptionModalComponent } from '../../components/washo/tip-description-modal/tip-description-modal.component';
import { environment } from '../../../environments/environment.prod';
import axios from 'axios';

// Define the interface for the recommendations
interface Recomendacion {
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
  standalone: false,
})
export class RecommendationsPage implements OnInit {
  public isLargeScreen: boolean = false;
  recomendaciones: Recomendacion[] = [];
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(private modalController: ModalController) {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  // cambios en tiempo real para el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 765;
  }

  ngOnInit() {
    this.loadRecomendaciones();
  }

  // Función para buscar los tips con IA
  async searchTips() {
    if (!this.searchQuery.trim()) {
      this.loadRecomendaciones();
      return;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente experto en consejos de lavado de ropa.',
            },
            {
              role: 'user',
              content: `Dame 10 consejos útiles de lavado de ropa relacionados con: ${this.searchQuery}. Los consejos deben ser prácticos y fáciles de entender.`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${environment.apiUrl_IA}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const tips = response.data.choices[0].message.content.trim();
      if (tips) {
        //  IA devuelve resultados
        this.recomendaciones = [
          { titulo: `Consejos sobre: ${this.searchQuery}`, descripcion: tips },
        ];
      } else {
        // IA no devuelve resultados
        this.errorMessage =
          'No se encontraron consejos relacionados con esa búsqueda.';
        this.loadRecomendaciones();
      }
    } catch (error) {
      console.error('Error buscando consejos:', error);
      this.errorMessage =
        'Hubo un error al realizar la búsqueda. Inténtalo de nuevo.';
      this.loadRecomendaciones();
    }
  }

  // Función para abrir la modal con el detalle de cada recomendación
  async openTipModal(titulo: string, descripcion: string) {
    const modal = await this.modalController.create({
      component: TipDescriptionModalComponent,
      componentProps: {
        titulo,
        descripcion: descripcion,
      },
    });
    return await modal.present();
  }

  // Cargar recomendaciones por defecto
  loadRecomendaciones() {
    this.recomendaciones = [
      {
        titulo: 'Cómo lavar ropa blanca',
        descripcion: `
        1. Usa detergentes especiales para ropa blanca.  
        2. Lava con agua caliente para eliminar mejor la suciedad.  
        3. Separa la ropa blanca de la de color para evitar manchas.  
        4. Agrega bicarbonato de sodio para potenciar la blancura.  
        5. No uses demasiado detergente, puede dejar residuos.  
        6. Evita usar cloro en exceso, puede debilitar las fibras.  
        7. Seca al sol para un blanqueamiento natural.  
        8. Remoja en agua con limón para eliminar manchas amarillas.  
        9. No mezcles con ropa muy sucia para evitar que absorba mugre.  
        10. Usa vinagre blanco en el enjuague para suavizar y limpiar mejor.  
      `,
      },
      {
        titulo: 'Cómo quitar manchas de vino',
        descripcion: `
        1. Actúa rápido para evitar que la mancha se fije.  
        2. Absorbe el exceso con una toalla de papel sin frotar.  
        3. Aplica sal sobre la mancha y deja que absorba el líquido.  
        4. Usa agua con gas para diluir la mancha.  
        5. Aplica vinagre blanco para neutralizar el color del vino.  
        6. Usa jabón líquido y frota suavemente antes de lavar.  
        7. Lava con agua caliente si la tela lo permite.  
        8. Para manchas secas, usa una mezcla de bicarbonato y agua.  
        9. Evita el calor hasta que la mancha desaparezca.  
        10. Si persiste, usa peróxido de hidrógeno en telas blancas.  
      `,
      },
      {
        titulo: 'Cómo lavar ropa delicada',
        descripcion: `
        1. Usa agua fría para evitar que la tela se dañe.  
        2. Lava a mano en lugar de usar lavadora cuando sea posible.  
        3. Usa detergente líquido suave y específico para ropa delicada.  
        4. No retuerzas la ropa al escurrir, exprímela suavemente.  
        5. Usa bolsas de malla si lavas en lavadora.  
        6. No uses suavizante en exceso, puede dañar algunas fibras.  
        7. Evita la secadora, deja secar al aire sobre una superficie plana.  
        8. No expongas la ropa delicada directamente al sol.  
        9. Plancha a temperatura baja o usa vapor para eliminar arrugas.  
        10. Sigue las instrucciones de la etiqueta de cada prenda.  
      `,
      },
      {
        titulo: 'Cómo lavar ropa oscura',
        descripcion: `
        1. Lava la ropa oscura con agua fría para evitar la decoloración.  
        2. Usa detergentes especiales para colores oscuros.  
        3. Voltea la ropa al revés antes de lavarla.  
        4. No sobrecargues la lavadora, permite que la ropa se enjuague bien.  
        5. Usa vinagre blanco en el enjuague para fijar los colores.  
        6. No uses demasiada luz solar directa al secar.  
        7. Lava la ropa oscura por separado de la clara.  
        8. Evita el uso de suavizante, puede dejar residuos en la tela.  
        9. No uses detergentes con blanqueadores.  
        10. Si es posible, seca al aire en un lugar con sombra.  
      `,
      },
      {
        titulo: 'Cómo secar ropa rápidamente',
        descripcion: `
        1. Usa una toalla seca para absorber el exceso de agua antes de secar.  
        2. Cuelga la ropa en un lugar con buena ventilación.  
        3. Usa un ventilador para acelerar el secado.  
        4. Si usas secadora, elige un ciclo corto y baja temperatura.  
        5. Centrifuga bien la ropa antes de sacarla de la lavadora.  
        6. Usa perchas para evitar arrugas mientras se seca.  
        7. Coloca la ropa en un área con luz solar indirecta.  
        8. Si tienes prisa, usa una secadora con bolas de secado.  
        9. No amontones la ropa, permite que circule el aire.  
        10. Para prendas pequeñas, usa un secador de pelo a baja temperatura.  
      `,
      },
    ];
  }
}
