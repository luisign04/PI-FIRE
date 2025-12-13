"""
Backend Flask com XGBoost para Sistema de Ocorrências de Bombeiros
Instruções de Instalação:
pip install flask flask-cors xgboost numpy pandas scikit-learn

Para executar:
python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import xgboost as xgb
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, classification_report
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Variáveis globais
modelo_tempo_resposta = None
modelo_necessita_samu = None
modelo_classificacao = None
label_encoders = {}
feature_names_tempo = [
    "complexidade_encoded",
    "turno",
    "dia_semana",
    "regiao_encoded",
    "natureza_encoded",
]
feature_names_samu = ["idade", "sexo_encoded", "natureza_encoded", "turno"]
feature_names_classificacao = [
    "idade",
    "sexo_encoded",
    "natureza_encoded",
    "tempo_resposta",
]


def criar_dados_sinteticos():
    """Cria dados sintéticos baseados no padrão do sistema de bombeiros"""
    np.random.seed(42)

    # Dados do pickerData.js
    naturezas = ["APH", "Incêndio", "Prevenção", "Produtos perigosos", "Resgate"]
    regioes = ["Agreste", "RMR", "Sertão", "Zona da mata"]
    sexos = ["Masculino", "Feminino", "Outro"]
    classificacoes = ["Ferida grave", "Ferida leve", "Óbito", "Vítima ilesa"]
    dias_semana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

    n_samples = 500
    dados = []

    for i in range(n_samples):
        natureza = np.random.choice(naturezas)
        regiao = np.random.choice(regioes)
        dia = np.random.choice(dias_semana)
        hora = np.random.randint(0, 24)

        # Turno: 0=Madrugada, 1=Manhã, 2=Tarde, 3=Noite
        if hora >= 6 and hora < 12:
            turno = 1
        elif hora >= 12 and hora < 18:
            turno = 2
        elif hora >= 18 and hora < 24:
            turno = 3
        else:
            turno = 0

        # Complexidade baseada na natureza
        if natureza in ["Incêndio", "Produtos perigosos"]:
            complexidade = np.random.randint(7, 11)
        elif natureza in ["APH"]:
            complexidade = np.random.randint(4, 8)
        else:
            complexidade = np.random.randint(3, 7)

        # Tempo de resposta (minutos) - influenciado por turno e complexidade
        tempo_base = 15
        if turno == 3:  # Noite
            tempo_base += 5
        if complexidade > 7:
            tempo_base += 8
        tempo_resposta = max(5, tempo_base + np.random.randint(-5, 10))

        # Dados da vítima
        idade = np.random.randint(1, 90)
        sexo = np.random.choice(sexos)

        # Necessita SAMU (baseado em natureza e idade)
        prob_samu = 0.3
        if natureza == "APH":
            prob_samu = 0.7
        if idade > 60:
            prob_samu += 0.2
        necessita_samu = np.random.random() < prob_samu

        # Classificação (baseada em idade e tipo)
        if necessita_samu and idade > 60:
            classificacao = np.random.choice(["Ferida grave", "Óbito"], p=[0.7, 0.3])
        elif natureza in ["Incêndio", "Produtos perigosos"]:
            classificacao = np.random.choice(
                ["Ferida grave", "Ferida leve", "Óbito"], p=[0.5, 0.4, 0.1]
            )
        else:
            classificacao = np.random.choice(
                ["Vítima ilesa", "Ferida leve"], p=[0.6, 0.4]
            )

        dados.append(
            {
                "natureza": natureza,
                "regiao": regiao,
                "dia_semana": dia,
                "turno": turno,
                "complexidade": complexidade,
                "tempo_resposta": tempo_resposta,
                "idade": idade,
                "sexo": sexo,
                "necessita_samu": 1 if necessita_samu else 0,
                "classificacao": classificacao,
            }
        )

    return pd.DataFrame(dados)


def preparar_encoders(df):
    """Prepara os label encoders para variáveis categóricas"""
    global label_encoders

    label_encoders["natureza"] = LabelEncoder()
    label_encoders["regiao"] = LabelEncoder()
    label_encoders["sexo"] = LabelEncoder()
    label_encoders["classificacao"] = LabelEncoder()

    label_encoders["natureza"].fit(df["natureza"])
    label_encoders["regiao"].fit(df["regiao"])
    label_encoders["sexo"].fit(df["sexo"])
    label_encoders["classificacao"].fit(df["classificacao"])


def treinar_modelos():
    """Treina todos os modelos de ML"""
    global modelo_tempo_resposta, modelo_necessita_samu, modelo_classificacao

    print("\n📊 Gerando dados sintéticos...")
    df = criar_dados_sinteticos()

    print("🔧 Preparando encoders...")
    preparar_encoders(df)

    # Preparar features encodadas
    df["natureza_encoded"] = label_encoders["natureza"].transform(df["natureza"])
    df["regiao_encoded"] = label_encoders["regiao"].transform(df["regiao"])
    df["sexo_encoded"] = label_encoders["sexo"].transform(df["sexo"])
    df["classificacao_encoded"] = label_encoders["classificacao"].transform(
        df["classificacao"]
    )

    # ========== MODELO 1: Predição de Tempo de Resposta ==========
    print("\n🚀 Treinando Modelo 1: Tempo de Resposta")
    X_tempo = df[feature_names_tempo].values
    y_tempo = df["tempo_resposta"].values

    modelo_tempo_resposta = xgb.XGBRegressor(
        n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
    )
    modelo_tempo_resposta.fit(X_tempo, y_tempo)

    y_pred_tempo = modelo_tempo_resposta.predict(X_tempo)
    mse_tempo = mean_squared_error(y_tempo, y_pred_tempo)
    r2_tempo = r2_score(y_tempo, y_pred_tempo)

    print(f"  ✓ MSE: {mse_tempo:.4f}")
    print(f"  ✓ R² Score: {r2_tempo:.4f}")

    # ========== MODELO 2: Predição se Necessita SAMU ==========
    print("\n🚑 Treinando Modelo 2: Necessidade de SAMU")
    X_samu = df[feature_names_samu].values
    y_samu = df["necessita_samu"].values

    modelo_necessita_samu = xgb.XGBClassifier(
        n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42
    )
    modelo_necessita_samu.fit(X_samu, y_samu)

    y_pred_samu = modelo_necessita_samu.predict(X_samu)
    acc_samu = (y_pred_samu == y_samu).mean()

    print(f"  ✓ Acurácia: {acc_samu:.4f}")

    # ========== MODELO 3: Predição de Classificação da Vítima ==========
    print("\n🏥 Treinando Modelo 3: Classificação da Vítima")
    X_class = df[feature_names_classificacao].values
    y_class = df["classificacao_encoded"].values

    modelo_classificacao = xgb.XGBClassifier(
        n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
    )
    modelo_classificacao.fit(X_class, y_class)

    y_pred_class = modelo_classificacao.predict(X_class)
    acc_class = (y_pred_class == y_class).mean()

    print(f"  ✓ Acurácia: {acc_class:.4f}")

    print("\n" + "=" * 50)
    print("✅ Todos os modelos treinados com sucesso!")
    print("=" * 50)


# Treinar modelos ao iniciar
print("\n" + "=" * 50)
print("🔥 Sistema de ML para Ocorrências de Bombeiros")
print("=" * 50)
treinar_modelos()

# ==================== ROTAS DA API ====================


@app.route("/health", methods=["GET"])
def health():
    """Verifica se a API está funcionando"""
    return jsonify(
        {
            "status": "ok",
            "modelos": ["tempo_resposta", "necessita_samu", "classificacao_vitima"],
            "message": "API funcionando corretamente",
        }
    )


@app.route("/predict/tempo-resposta", methods=["POST"])
def predict_tempo_resposta():
    """Prevê o tempo de resposta estimado"""
    try:
        data = request.json

        natureza = data.get("natureza", "APH")
        regiao = data.get("regiao", "RMR")
        turno = data.get("turno", 1)  # 0=Madrugada, 1=Manhã, 2=Tarde, 3=Noite
        dia_semana = data.get("dia_semana", "Segunda")
        complexidade = data.get("complexidade", 5)

        # Verificar se os valores existem nos encoders
        if natureza not in label_encoders["natureza"].classes_:
            natureza = label_encoders["natureza"].classes_[0]
        if regiao not in label_encoders["regiao"].classes_:
            regiao = label_encoders["regiao"].classes_[0]

        # Encodar
        natureza_enc = label_encoders["natureza"].transform([natureza])[0]
        regiao_enc = label_encoders["regiao"].transform([regiao])[0]

        # Fazer predição
        X = np.array([[complexidade, turno, 0, regiao_enc, natureza_enc]])
        tempo_previsto = float(modelo_tempo_resposta.predict(X)[0])

        return jsonify(
            {
                "tempo_estimado_minutos": round(tempo_previsto, 1),
                "entrada": {
                    "natureza": natureza,
                    "regiao": regiao,
                    "turno": turno,
                    "complexidade": complexidade,
                },
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/necessita-samu", methods=["POST"])
def predict_necessita_samu():
    """Prevê se a ocorrência necessitará de SAMU"""
    try:
        data = request.json

        idade = data.get("idade", 30)
        sexo = data.get("sexo", "Masculino")
        natureza = data.get("natureza", "APH")
        turno = data.get("turno", 1)

        # Verificar e ajustar valores
        if natureza not in label_encoders["natureza"].classes_:
            natureza = label_encoders["natureza"].classes_[0]
        if sexo not in label_encoders["sexo"].classes_:
            sexo = label_encoders["sexo"].classes_[0]

        # Encodar
        sexo_enc = label_encoders["sexo"].transform([sexo])[0]
        natureza_enc = label_encoders["natureza"].transform([natureza])[0]

        # Fazer predição
        X = np.array([[idade, sexo_enc, natureza_enc, turno]])
        probabilidade = float(modelo_necessita_samu.predict_proba(X)[0][1])
        necessita = bool(modelo_necessita_samu.predict(X)[0])

        return jsonify(
            {
                "necessita_samu": necessita,
                "probabilidade": round(probabilidade * 100, 1),
                "recomendacao": (
                    "Acionar SAMU"
                    if probabilidade > 0.6
                    else "SAMU pode não ser necessário"
                ),
                "entrada": {
                    "idade": idade,
                    "sexo": sexo,
                    "natureza": natureza,
                    "turno": turno,
                },
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/classificacao-vitima", methods=["POST"])
def predict_classificacao():
    """Prevê a classificação da vítima"""
    try:
        data = request.json

        idade = data.get("idade", 30)
        sexo = data.get("sexo", "Masculino")
        natureza = data.get("natureza", "APH")
        tempo_resposta = data.get("tempo_resposta", 15)

        # Verificar e ajustar valores
        if natureza not in label_encoders["natureza"].classes_:
            natureza = label_encoders["natureza"].classes_[0]
        if sexo not in label_encoders["sexo"].classes_:
            sexo = label_encoders["sexo"].classes_[0]

        # Encodar
        sexo_enc = label_encoders["sexo"].transform([sexo])[0]
        natureza_enc = label_encoders["natureza"].transform([natureza])[0]

        # Fazer predição
        X = np.array([[idade, sexo_enc, natureza_enc, tempo_resposta]])
        classificacao_enc = modelo_classificacao.predict(X)[0]
        probabilidades = modelo_classificacao.predict_proba(X)[0]

        classificacao = label_encoders["classificacao"].inverse_transform(
            [int(classificacao_enc)]
        )[0]

        # Montar distribuição de probabilidades
        prob_dict = {}
        for i, classe in enumerate(label_encoders["classificacao"].classes_):
            prob_dict[classe] = round(float(probabilidades[i]) * 100, 1)

        return jsonify(
            {
                "classificacao_prevista": classificacao,
                "probabilidades": prob_dict,
                "entrada": {
                    "idade": idade,
                    "sexo": sexo,
                    "natureza": natureza,
                    "tempo_resposta": tempo_resposta,
                },
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/completo", methods=["POST"])
def predict_completo():
    """Faz todas as predições de uma vez"""
    try:
        data = request.json

        # Extrair dados
        natureza = data.get("natureza", "APH")
        regiao = data.get("regiao", "RMR")
        turno = data.get("turno", 1)
        complexidade = data.get("complexidade", 5)
        idade = data.get("idade", 30)
        sexo = data.get("sexo", "Masculino")

        # Predição 1: Tempo de resposta
        if natureza not in label_encoders["natureza"].classes_:
            natureza = label_encoders["natureza"].classes_[0]
        if regiao not in label_encoders["regiao"].classes_:
            regiao = label_encoders["regiao"].classes_[0]
        if sexo not in label_encoders["sexo"].classes_:
            sexo = label_encoders["sexo"].classes_[0]

        natureza_enc = label_encoders["natureza"].transform([natureza])[0]
        regiao_enc = label_encoders["regiao"].transform([regiao])[0]
        sexo_enc = label_encoders["sexo"].transform([sexo])[0]

        X_tempo = np.array([[complexidade, turno, 0, regiao_enc, natureza_enc]])
        tempo_previsto = float(modelo_tempo_resposta.predict(X_tempo)[0])

        # Predição 2: Necessita SAMU
        X_samu = np.array([[idade, sexo_enc, natureza_enc, turno]])
        prob_samu = float(modelo_necessita_samu.predict_proba(X_samu)[0][1])
        necessita_samu = bool(modelo_necessita_samu.predict(X_samu)[0])

        # Predição 3: Classificação
        X_class = np.array([[idade, sexo_enc, natureza_enc, tempo_previsto]])
        classificacao_enc = modelo_classificacao.predict(X_class)[0]
        classificacao = label_encoders["classificacao"].inverse_transform(
            [int(classificacao_enc)]
        )[0]

        return jsonify(
            {
                "tempo_resposta_estimado": round(tempo_previsto, 1),
                "necessita_samu": necessita_samu,
                "probabilidade_samu": round(prob_samu * 100, 1),
                "classificacao_prevista": classificacao,
                "entrada": data,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    """Retorna a importância das features dos modelos"""
    try:
        importance_tempo = modelo_tempo_resposta.feature_importances_
        features_tempo = []

        labels = ["Complexidade", "Turno", "Dia Semana", "Região", "Natureza"]
        for i, label in enumerate(labels):
            features_tempo.append(
                {
                    "feature": label,
                    "importance": float(importance_tempo[i]),
                    "modelo": "tempo_resposta",
                }
            )

        features_tempo.sort(key=lambda x: x["importance"], reverse=True)

        return jsonify({"importance": features_tempo})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/modelos/info", methods=["GET"])
def modelos_info():
    """Retorna informações sobre os modelos disponíveis"""
    return jsonify(
        {
            "modelos": [
                {
                    "nome": "Tempo de Resposta",
                    "endpoint": "/predict/tempo-resposta",
                    "descricao": "Prevê o tempo estimado de resposta em minutos",
                    "inputs": ["natureza", "regiao", "turno", "complexidade"],
                },
                {
                    "nome": "Necessidade de SAMU",
                    "endpoint": "/predict/necessita-samu",
                    "descricao": "Prevê se a ocorrência necessitará de SAMU",
                    "inputs": ["idade", "sexo", "natureza", "turno"],
                },
                {
                    "nome": "Classificação da Vítima",
                    "endpoint": "/predict/classificacao-vitima",
                    "descricao": "Prevê a classificação da vítima",
                    "inputs": ["idade", "sexo", "natureza", "tempo_resposta"],
                },
                {
                    "nome": "Predição Completa",
                    "endpoint": "/predict/completo",
                    "descricao": "Faz todas as predições de uma vez",
                    "inputs": [
                        "natureza",
                        "regiao",
                        "turno",
                        "complexidade",
                        "idade",
                        "sexo",
                    ],
                },
            ]
        }
    )


@app.route("/valores-possiveis", methods=["GET"])
def valores_possiveis():
    """Retorna os valores possíveis para cada campo"""
    return jsonify(
        {
            "naturezas": label_encoders["natureza"].classes_.tolist(),
            "regioes": label_encoders["regiao"].classes_.tolist(),
            "sexos": label_encoders["sexo"].classes_.tolist(),
            "classificacoes": label_encoders["classificacao"].classes_.tolist(),
            "turnos": {
                0: "Madrugada (00:00 - 05:59)",
                1: "Manhã (06:00 - 11:59)",
                2: "Tarde (12:00 - 17:59)",
                3: "Noite (18:00 - 23:59)",
            },
        }
    )


# ==================== INICIAR SERVIDOR ====================

if __name__ == "__main__":
    print("\n🚀 Servidor rodando em http://localhost:5000")
    print("🔥 Modelos XGBoost carregados e prontos!")
    print("\nEndpoints disponíveis:")
    print("  GET  /health                      - Status da API")
    print("  POST /predict/tempo-resposta      - Prever tempo de resposta")
    print("  POST /predict/necessita-samu      - Prever necessidade SAMU")
    print("  POST /predict/classificacao-vitima - Prever classificação")
    print("  POST /predict/completo            - Todas as predições")
    print("  GET  /feature-importance          - Importância das features")
    print("  GET  /modelos/info                - Info dos modelos")
    print("  GET  /valores-possiveis           - Valores válidos")
    print("\n" + "=" * 50 + "\n")

    app.run(debug=True, port=5000, host="0.0.0.0")
