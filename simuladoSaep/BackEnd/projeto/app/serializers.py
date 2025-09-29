from rest_framework import serializers
from .models import Usuario, Tarefa

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class TarefaSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    usuario_detalhes = UsuarioSerializer(source='usuario', read_only=True)
    status_display = serializers.SerializerMethodField()
    

    class Meta:
        model = Tarefa
        fields = ['id', 'nome', 'descricao', 'nomeSetor', 'dataCadastro',
                  'prioridade', 'status', 'usuario', 'usuario_detalhes', 'status_display']

    def get_status_display(self, obj):
        return obj.get_status_display()
